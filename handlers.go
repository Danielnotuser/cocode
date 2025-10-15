package main

import (
	"net/http"
)

type PageData struct {
	Username string
	Sessions map[string]Session
	Template string
}

type Session struct {
	Owner       string
	Language    string
	ProjectName string
}

func dashboardHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("username")
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	data := PageData{
		Username: cookie.Value,
		Sessions: sessions,
		Template: "dashboard",
	}

	err = templates.ExecuteTemplate(w, "base.html", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		username := r.FormValue("username")
		password := r.FormValue("password")

		if _, exists := users[username]; exists {
			http.Error(w, "User already exists", http.StatusBadRequest)
			return
		}

		users[username] = password
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	data := PageData{Template: "register"}
	err := templates.ExecuteTemplate(w, "base.html", data)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		username := r.FormValue("username")
		password := r.FormValue("password")

		if storedPassword, exists := users[username]; exists && storedPassword == password {
			http.SetCookie(w, &http.Cookie{
				Name:  "username",
				Value: username,
			})
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}

		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	data := PageData{Template: "login"}
	err := templates.ExecuteTemplate(w, "base.html", data)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func createSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		cookie, err := r.Cookie("username")
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		sessionID := r.FormValue("session_id")
		language := r.FormValue("language")
		projectName := r.FormValue("project_name")

		if sessionID == "" {
			http.Error(w, "Session ID required", http.StatusBadRequest)
			return
		}

		sessions[sessionID] = Session{
			Owner:       cookie.Value,
			Language:    language,
			ProjectName: projectName,
		}
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func editorHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("username")
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	sessionID := r.URL.Query().Get("session_id")
	session, exists := sessions[sessionID]
	if !exists {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	}

	data := struct {
		Username  string
		SessionID string
		Session   Session
		Template  string
	}{
		Username:  cookie.Value,
		SessionID: sessionID,
		Session:   session,
		Template:  "editor",
	}

	err = templates.ExecuteTemplate(w, "base.html", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func deleteSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		cookie, err := r.Cookie("username")
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		sessionID := r.FormValue("session_id")
		session, exists := sessions[sessionID]

		if !exists || session.Owner != cookie.Value {
			http.Error(w, "Session not found or access denied", http.StatusForbidden)
			return
		}

		delete(sessions, sessionID)
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
