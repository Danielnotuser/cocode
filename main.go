package main

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var templates *template.Template
var db *sql.DB

func main() {
	var err error
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "cocode.db"
	}
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// Create tables if not exist
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			user_id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS sessions (
			session_id INTEGER PRIMARY KEY AUTOINCREMENT,
			owner_id INTEGER NOT NULL,
			language TEXT,
			project_name TEXT,
			content TEXT DEFAULT '',
			FOREIGN KEY(owner_id) REFERENCES users(user_id)
		);
		CREATE TABLE IF NOT EXISTS collabs (
			session_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			PRIMARY KEY (session_id, user_id),
			FOREIGN KEY(user_id) REFERENCES users(user_id),
			FOREIGN KEY(session_id) REFERENCES sessions(session_id)
		);
	`)
	if err != nil {
		log.Fatal("Error creating tables:", err)
	}

	// Load templates
	templates, err = template.ParseGlob("templates/*.html")
	if err != nil {
		log.Fatal("Error loading templates:", err)
	}

	http.HandleFunc("/", dashboardHandler)
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/logout", logoutHandler)
	http.HandleFunc("/create-session", createSessionHandler)
	http.HandleFunc("/add-collab", addCollabHandler)
	http.HandleFunc("/editor", editorHandler)
	http.HandleFunc("/delete-session", deleteSessionHandler)
	http.HandleFunc("/save-session", saveSessionHandler) // Добавляем новый обработчик
	http.HandleFunc("/ws", serveWs)                      // Добавляем WebSocket endpoint
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
