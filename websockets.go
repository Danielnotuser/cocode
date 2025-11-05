package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // В продакшене нужно проверять origin
	},
}

// Hub управляет всеми активными подключениями
type Hub struct {
	// sessions хранит подключения по ID сессии
	sessions map[string]map[*Client]bool
	mu       sync.RWMutex
}

// Client представляет подключение WebSocket
type Client struct {
	hub       *Hub
	conn      *websocket.Conn
	send      chan []byte
	sessionID string
	username  string
}

var hub = &Hub{
	sessions: make(map[string]map[*Client]bool),
}

// Добавляем клиента в хаб
func (h *Hub) register(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.sessions[client.sessionID] == nil {
		h.sessions[client.sessionID] = make(map[*Client]bool)
	}
	h.sessions[client.sessionID][client] = true
}

// Удаляем клиента из хаба
func (h *Hub) unregister(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if clients, ok := h.sessions[client.sessionID]; ok {
		delete(clients, client)
		if len(clients) == 0 {
			delete(h.sessions, client.sessionID)
		}
	}
}

// Рассылаем сообщение всем клиентам в сессии
func (h *Hub) broadcast(sessionID string, message []byte, sender *Client) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if clients, ok := h.sessions[sessionID]; ok {
		for client := range clients {
			if client != sender {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(clients, client)
				}
			}
		}
	}
}

// Обработчик WebSocket соединения
func serveWs(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session_id")
	username := r.URL.Query().Get("username")

	if sessionID == "" || username == "" {
		http.Error(w, "Session ID and username required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	client := &Client{
		hub:       hub,
		conn:      conn,
		send:      make(chan []byte, 256),
		sessionID: sessionID,
		username:  username,
	}

	client.hub.register(client)

	// Запускаем горутины для чтения и записи
	go client.writePump()
	go client.readPump()
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister(c)
		c.conn.Close()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			break
		}

		// Рассылаем сообщение всем в сессии
		c.hub.broadcast(c.sessionID, message, c)
	}
}

func (c *Client) writePump() {
	defer func() {
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}
}
