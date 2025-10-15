package main

import (
	"html/template"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

var sessions = make(map[string]Session)
var users = make(map[string]string)
var templates *template.Template

func main() {
	var err error
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
