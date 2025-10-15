package main

import (
	"database/sql"
	"net/http"
)

type PageData struct {
	Username string
	Sessions map[string]Session
	Template string
	Warning  string
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

	// Получаем все сессии из БД
	rows, err := db.Query("SELECT session_id, username FROM sessions")
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	sessions := make(map[string]string)
	for rows.Next() {
		var sid, uname string
		if err := rows.Scan(&sid, &uname); err == nil {
			sessions[sid] = uname
		}
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
	var warning string
	if r.Method == "POST" {
		username := r.FormValue("username")
		password := r.FormValue("password")

		// Check if user exists
		var exists int
		err := db.QueryRow("SELECT COUNT(*) FROM users WHERE username = ?", username).Scan(&exists)
		if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}
		if exists > 0 {
			warning = "User already exists. Please choose another username."
		} else {
			// Insert user
			_, err = db.Exec("INSERT INTO users(username, password) VALUES (?, ?)", username, password)
			if err != nil {
				http.Error(w, "DB error", http.StatusInternalServerError)
				return
			}
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
	}

	data := PageData{Template: "register", Warning: warning}
	err := templates.ExecuteTemplate(w, "base.html", data)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var warning string
	if r.Method == "POST" {
		username := r.FormValue("username")
		password := r.FormValue("password")

		// Check credentials in DB
		var storedPassword string
		err := db.QueryRow("SELECT password FROM users WHERE username = ?", username).Scan(&storedPassword)
		if err == sql.ErrNoRows || storedPassword != password {
			warning = "Invalid username or password. Please try again."
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		} else {
			http.SetCookie(w, &http.Cookie{
				Name:  "username",
				Value: username,
			})
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}
	}

	data := PageData{Template: "login", Warning: warning}
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

		// Insert session into DB
		_, err = db.Exec("INSERT OR REPLACE INTO sessions(session_id, username) VALUES (?, ?)", sessionID, cookie.Value)
		if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
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
