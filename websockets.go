package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// YjsHub manages Yjs document state and WebSocket connections for collaborative editing
type YjsHub struct {
	sessionDocs map[string]*SessionDoc
	mu          sync.RWMutex
}

type SessionDoc struct {
	sessionID  string
	clients    map[*YjsClient]bool
	updateBuf  [][]byte
	clockMutex sync.Mutex
	clock      int
	mu         sync.RWMutex
}

type YjsClient struct {
	hub       *YjsHub
	sessionID string
	username  string
	conn      *websocket.Conn
	send      chan interface{}
	done      chan struct{}
}

var yjsHub = &YjsHub{
	sessionDocs: make(map[string]*SessionDoc),
}

// YJS Protocol message types
type YjsMessage struct {
	Type int             `json:"type"`
	Data json.RawMessage `json:"data,omitempty"`
}

type SyncMessage struct {
	Clock int    `json:"clock"`
	State []byte `json:"state"`
}

type UpdateMessage struct {
	Update []byte `json:"update"`
}

// getOrCreateSessionDoc retrieves or creates a session document
func (h *YjsHub) getOrCreateSessionDoc(sessionID string) *SessionDoc {
	h.mu.Lock()
	defer h.mu.Unlock()

	if doc, exists := h.sessionDocs[sessionID]; exists {
		return doc
	}

	doc := &SessionDoc{
		sessionID: sessionID,
		clients:   make(map[*YjsClient]bool),
		updateBuf: make([][]byte, 0),
		clock:     0,
	}
	h.sessionDocs[sessionID] = doc
	return doc
}

// registerClient adds a client to the session
func (doc *SessionDoc) registerClient(client *YjsClient) {
	doc.mu.Lock()
	defer doc.mu.Unlock()
	doc.clients[client] = true
}

// unregisterClient removes a client from the session
func (doc *SessionDoc) unregisterClient(client *YjsClient) {
	doc.mu.Lock()
	defer doc.mu.Unlock()

	delete(doc.clients, client)
	if len(doc.clients) == 0 {
		yjsHub.mu.Lock()
		delete(yjsHub.sessionDocs, doc.sessionID)
		yjsHub.mu.Unlock()
	}
}

// broadcastUpdate sends an update to all clients except sender
func (doc *SessionDoc) broadcastUpdate(update []byte, sender *YjsClient) {
	doc.mu.RLock()
	defer doc.mu.RUnlock()

	for client := range doc.clients {
		if client != sender {
			select {
			case client.send <- UpdateMessage{Update: update}:
			default:
			}
		}
	}
}

// Handler for WebSocket connections with Yjs protocol
func serveYjsWs(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session")
	if sessionID == "" {
		sessionID = r.URL.Query().Get("session_id")
	}
	username := r.URL.Query().Get("username")

	if sessionID == "" || username == "" {
		http.Error(w, "Missing session or username", http.StatusBadRequest)
		return
	}

	// Verify user has access to session
	sessionIDInt, err := strconv.Atoi(sessionID)
	if err != nil {
		http.Error(w, "Invalid session ID", http.StatusBadRequest)
		return
	}

	var owner string
	err = db.QueryRow(`SELECT u.username FROM sessions s 
		JOIN users u ON s.owner_id = u.user_id WHERE s.session_id = ?`, sessionIDInt).Scan(&owner)
	if err != nil {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	}

	if owner != username {
		var collabCount int
		err = db.QueryRow(`SELECT COUNT(*) FROM collabs c 
			JOIN users u ON c.user_id = u.user_id 
			WHERE c.session_id = ? AND u.username = ?`, sessionIDInt, username).Scan(&collabCount)
		if err != nil || collabCount == 0 {
			http.Error(w, "Access denied", http.StatusForbidden)
			return
		}
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[Yjs] WebSocket upgrade error:", err)
		return
	}

	client := &YjsClient{
		hub:       yjsHub,
		sessionID: sessionID,
		username:  username,
		conn:      conn,
		send:      make(chan interface{}, 256),
		done:      make(chan struct{}),
	}

	sessionDoc := yjsHub.getOrCreateSessionDoc(sessionID)
	sessionDoc.registerClient(client)

	log.Printf("[Yjs] Client connected: %s to session %s\n", username, sessionID)

	go client.readPump(sessionDoc)
	go client.writePump()
}

func (c *YjsClient) readPump(sessionDoc *SessionDoc) {
	defer func() {
		sessionDoc.unregisterClient(c)
		close(c.done)
		c.conn.Close()
		log.Printf("[WebSocket] Client disconnected: %s from session %s\n", c.username, c.sessionID)
	}()

	for {
		var msg map[string]interface{}
		err := c.conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[WebSocket] Error: %v\n", err)
			}
			return
		}

		// Handle code_update messages from frontend
		if msgType, ok := msg["type"].(string); ok && msgType == "code_update" {
			log.Printf("[WebSocket] Code update from %s\n", c.username)

			// Broadcast to all other clients in the session
			broadcastToOthers(sessionDoc, c, msg)
		}
	}
}

// broadcastToOthers sends a message to all clients except the sender
func broadcastToOthers(sessionDoc *SessionDoc, sender *YjsClient, msg map[string]interface{}) {
	sessionDoc.mu.RLock()
	defer sessionDoc.mu.RUnlock()

	for client := range sessionDoc.clients {
		if client != sender {
			select {
			case client.send <- msg:
			default:
				log.Printf("[WebSocket] Client buffer full, dropping message\n")
			}
		}
	}
}

func (c *YjsClient) writePump() {
	defer c.conn.Close()

	for {
		select {
		case msg, ok := <-c.send:
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			err := c.conn.WriteJSON(msg)
			if err != nil {
				return
			}

		case <-c.done:
			return
		}
	}
}

func mustMarshal(v interface{}) json.RawMessage {
	data, err := json.Marshal(v)
	if err != nil {
		log.Printf("[WebSocket] Marshal error: %v\n", err)
		return json.RawMessage{}
	}
	return json.RawMessage(data)
}
