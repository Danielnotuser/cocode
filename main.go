package main

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

// var sessions = make(map[string]Session)
// var users = make(map[string]string)
var templates *template.Template
var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite3", "cocode.db")
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
			user_id INTEGER NOT NULL,
			language TEXT,
			project_name TEXT,
			FOREIGN KEY(user_id) REFERENCES users(user_id)
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
	http.HandleFunc("/create-session", createSessionHandler)
	http.HandleFunc("/editor", editorHandler)
	http.HandleFunc("/delete-session", deleteSessionHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
