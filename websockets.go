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

	log.Printf("[Yjs] Client connected: %s to session %s (Yjs protocol)\n", username, sessionID)

	go client.readPump(sessionDoc)
	go client.writePump()
}

func (c *YjsClient) readPump(sessionDoc *SessionDoc) {
	defer func() {
		sessionDoc.unregisterClient(c)
		close(c.done)
		c.conn.Close()
		log.Printf("[Yjs] Client disconnected: %s from session %s\n", c.username, c.sessionID)
	}()

	for {
		messageType, data, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[Yjs] WebSocket error: %v\n", err)
			}
			return
		}

		if messageType != websocket.BinaryMessage {
			continue
		}

		// Parse Yjs protocol message
		if len(data) < 1 {
			continue
		}

		msgType := data[0]
		log.Printf("[Yjs] readPump from %s: received message type=%d, len=%d\n", c.username, msgType, len(data))

		// y-websocket protocol message types:
		// 0 = Sync Step 1
		// 1 = Sync Step 2 (also Awareness Update)
		// 2 = Update (from client)
		// 3 = Query Awareness
		switch msgType {
		case 0: // Sync Step 1
			log.Printf("[Yjs] Sync step 1 from %s\n", c.username)
			// Reply by sending all buffered messages exactly as they were received.
			// Those messages already contain the proper Yjs message framing and will be
			// understood by the client. This avoids attempting to reconstruct a single
			// combined Sync Step 2 buffer which can lead to malformed frames.
			sessionDoc.mu.RLock()
			for _, update := range sessionDoc.updateBuf {
				// send each stored message as-is
				c.send <- update
			}
			sessionDoc.mu.RUnlock()

		case 1: // Sync Step 2 or Awareness Update
			log.Printf("[Yjs] Sync step 2 / Awareness from %s\n", c.username)
			// Client is syncing or sending awareness, acknowledge

		case 2: // Update (from client) — THIS IS THE KEY FIX!
			log.Printf("[Yjs] Update from %s (msg type 2, len=%d)\n", c.username, len(data))
			// Store update and broadcast to all other clients
			sessionDoc.clockMutex.Lock()
			sessionDoc.clock++
			sessionDoc.clockMutex.Unlock()

			// Store the full binary message as received so we can replay it to newly connecting clients
			sessionDoc.mu.Lock()
			sessionDoc.updateBuf = append(sessionDoc.updateBuf, data)
			sessionDoc.mu.Unlock()

			// Broadcast update to all other clients
			broadcastToOthers(sessionDoc, c, data)

		case 3: // Query Awareness
			log.Printf("[Yjs] Query Awareness from %s\n", c.username)
			// TODO: implement awareness queries if needed

		default:
			log.Printf("[Yjs] Unknown message type: %d from %s\n", msgType, c.username)
		}
	}
}

// broadcastToOthers sends a binary message to all clients except the sender
func broadcastToOthers(sessionDoc *SessionDoc, sender *YjsClient, data []byte) {
	sessionDoc.mu.RLock()
	clientsCount := len(sessionDoc.clients)
	defer sessionDoc.mu.RUnlock()

	// Log broadcast details for debugging
	log.Printf("[Yjs] Broadcasting message from %s to %d peers (session %s); payload len=%d\n", sender.username, clientsCount-1, sessionDoc.sessionID, len(data))

	for client := range sessionDoc.clients {
		if client != sender {
			select {
			case client.send <- data:
			default:
				log.Printf("[Yjs] Client buffer full, dropping message for %s\n", client.username)
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

			// Handle binary data from Yjs
			if data, ok := msg.([]byte); ok {
				log.Printf("[Yjs] writePump for %s: sending binary msg len=%d\n", c.username, len(data))
				err := c.conn.WriteMessage(websocket.BinaryMessage, data)
				if err != nil {
					log.Printf("[Yjs] writePump for %s: error sending: %v\n", c.username, err)
					return
				}
				log.Printf("[Yjs] writePump for %s: sent successfully\n", c.username)
			} else {
				log.Printf("[Yjs] writePump for %s: msg is not []byte, type=%T\n", c.username, msg)
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
