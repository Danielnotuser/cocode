package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type PageData struct {
	Username string
	Sessions map[string]Session
	Template string
	Warning  string
}

type Session struct {
	SessionID   int
	Owner       string
	Language    string
	ProjectName string
	Content     string
}

// Add this new struct for API responses
type SaveResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}

// WebSocket message structure
type WSMessage struct {
	Type      string `json:"type"`
	Content   string `json:"content"`
	Username  string `json:"username"`
	SessionID string `json:"session_id"`
}

// Response for interpretation
type InterpretResponse struct {
	Success bool   `json:"success"`
	Output  string `json:"output,omitempty"`
	Error   string `json:"error,omitempty"`
}

func authFromJwt(r *http.Request) (string, error) {
	jwtCookie, err := r.Cookie("jwt")
	if err != nil {
		return "", errors.New("cookie not found")
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev_secret"
	}
	token, err := jwt.Parse(jwtCookie.Value, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["username"] == nil {
		return "", errors.New("invalid token")
	}
	return claims["username"].(string), nil
}

func dashboardHandler(w http.ResponseWriter, r *http.Request) {
	username, err := authFromJwt(r)
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}
	// Get sessions from db (join users for username)
	rows, err := db.Query(`SELECT 
								s.session_id,
								u.username AS owner_username,
								s.language,
								s.project_name
							FROM sessions s
							JOIN users u ON s.owner_id = u.user_id
							WHERE u.username = ?
							OR s.session_id IN (
									SELECT c.session_id
									FROM collabs c
									JOIN users cu ON c.user_id = cu.user_id
									WHERE cu.username = ?);`, username, username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()
	sessionObjs := make(map[string]Session)
	for rows.Next() {
		var sid int
		var uname, lang, proj string
		if err := rows.Scan(&sid, &uname, &lang, &proj); err == nil {
			sessionObjs[strconv.Itoa(sid)] = Session{SessionID: sid, Owner: uname, Language: lang, ProjectName: proj}
		}
	}
	data := PageData{
		Username: username,
		Sessions: sessionObjs,
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
		confirmPassword := r.FormValue("confirm_password")

		// Check if passwords match
		if password != confirmPassword {
			warning = "Passwords do not match."
		} else if len(password) < 6 {
			warning = "Password must be at least 6 characters long."
		} else {
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
				// Hash password
				hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
				if err != nil {
					http.Error(w, "Error hashing password", http.StatusInternalServerError)
					return
				}
				// Insert user with hash
				_, err = db.Exec("INSERT INTO users(username, password_hash) VALUES (?, ?)", username, string(hash))
				if err != nil {
					http.Error(w, "DB error", http.StatusInternalServerError)
					return
				}
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}
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

		// Get password hash from DB
		var hash string
		err := db.QueryRow("SELECT password_hash FROM users WHERE username = ?", username).Scan(&hash)
		if errors.Is(err, sql.ErrNoRows) {
			warning = "Invalid username or password. Please try again."
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		} else {
			// Compare hash
			if bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) != nil {
				warning = "Invalid username or password. Please try again."
			} else {
				// Generate JWT
				token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
					"username": username,
					"exp":      time.Now().Add(24 * time.Hour).Unix(),
				})
				secret := os.Getenv("JWT_SECRET")
				if secret == "" {
					secret = "dev_secret" // fallback for dev
				}
				tokenString, err := token.SignedString([]byte(secret))
				if err != nil {
					http.Error(w, "Error generating token", http.StatusInternalServerError)
					return
				}
				// Set JWT as cookie
				http.SetCookie(w, &http.Cookie{
					Name:     "jwt",
					Value:    tokenString,
					Path:     "/",
					HttpOnly: true,
					MaxAge:   86400,
				})
				http.Redirect(w, r, "/", http.StatusSeeOther)
			}
		}
	}

	data := PageData{Template: "login", Warning: warning}
	err := templates.ExecuteTemplate(w, "base.html", data)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	// Delete JWT cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1, // Delete cookie
	})
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}

func createSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Get username from JWT
	username, err := authFromJwt(r)
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	language := r.FormValue("language")
	projectName := r.FormValue("project_name")

	if language == "" || projectName == "" {
		http.Error(w, "Language and Project Name required", http.StatusBadRequest)
		return
	}
	// Get user_id for username
	var userID int
	err = db.QueryRow("SELECT user_id FROM users WHERE username = ?", username).Scan(&userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}
	// Insert session into DB
	_, err = db.Exec("INSERT INTO sessions(owner_id, language, project_name, content) VALUES (?, ?, ?, ?)", userID, language, projectName, "// Start coding here...")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func saveSessionContent(sessionIDInt int, content string, username string) error {
	// Verify user has access to this session (owner OR collaborator)
	var owner string
	var ownerID int
	err := db.QueryRow(`SELECT u.username, s.owner_id FROM sessions s 
		JOIN users u ON s.owner_id = u.user_id 
		WHERE s.session_id = ?`, sessionIDInt).Scan(&owner, &ownerID)
	if errors.Is(err, sql.ErrNoRows) {
		return errors.New("session not found")
	} else if err != nil {
		return err
	}

	// Check if user is owner
	if owner != username {
		// If not owner, check if user is collaborator
		var collaboratorCount int
		err = db.QueryRow(`SELECT COUNT(*) FROM collabs c 
			JOIN users u ON c.user_id = u.user_id 
			WHERE c.session_id = ? AND u.username = ?`, sessionIDInt, username).Scan(&collaboratorCount)
		if err != nil {
			return err
		}
		if collaboratorCount == 0 {
			return errors.New("access denied")
		}
	}

	// Update session content in database
	_, err = db.Exec("UPDATE sessions SET content = ? WHERE session_id = ?", content, sessionIDInt)
	return err
}

// Add this new handler for saving session content
func saveSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Auth via JWT
	username, err := authFromJwt(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	sessionID := r.FormValue("session_id")
	content := r.FormValue("content")

	if sessionID == "" {
		http.Error(w, "Session ID required", http.StatusBadRequest)
		return
	}

	// Parse session ID
	sessionIDInt, err := strconv.Atoi(sessionID)
	if err != nil {
		http.Error(w, "Invalid session ID", http.StatusBadRequest)
		return
	}

	// Сохраняем контент
	err = saveSessionContent(sessionIDInt, content, username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(SaveResponse{Success: true})
}

// interpretHandler runs Python code inside a docker container and returns output
func interpretHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username, err := authFromJwt(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var payload struct {
		SessionID string `json:"session_id"`
		Content   string `json:"content"`
		Stdin     string `json:"stdin,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}
	if payload.SessionID == "" {
		http.Error(w, "Session ID required", http.StatusBadRequest)
		return
	}
	sid, err := strconv.Atoi(payload.SessionID)
	if err != nil {
		http.Error(w, "Invalid session id", http.StatusBadRequest)
		return
	}

	// Verify session exists and user has access
	var ownerUsername, language string
	var ownerID int
	err = db.QueryRow(`SELECT u.username, s.language, s.owner_id FROM sessions s JOIN users u ON s.owner_id = u.user_id WHERE s.session_id = ?`, sid).Scan(&ownerUsername, &language, &ownerID)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// access check
	if ownerUsername != username {
		var collabCount int
		err = db.QueryRow(`SELECT COUNT(*) FROM collabs c JOIN users u ON c.user_id = u.user_id WHERE c.session_id = ? AND u.username = ?`, sid, username).Scan(&collabCount)
		if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}
		if collabCount == 0 {
			http.Error(w, "Access denied", http.StatusForbidden)
			return
		}
	}

	if strings.ToLower(language) != "python" {
		http.Error(w, "Interpretation is only supported for python sessions", http.StatusBadRequest)
		return
	}

	// Ensure docker image exists, otherwise try to build it
	img := "cocode-python-runner:latest"
	if err := exec.Command("docker", "inspect", "--type=image", img).Run(); err != nil {
		// try to build
		buildCmd := exec.Command("docker", "build", "-t", img, "docker/python-runner")
		var b bytes.Buffer
		buildCmd.Stdout = &b
		buildCmd.Stderr = &b
		if err := buildCmd.Run(); err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(InterpretResponse{Success: false, Error: "Failed to build python runner image: " + b.String()})
			return
		}
	}

	// Run the code inside docker with timeout and limited resources
	// Use a shell heredoc to create the script inside the container so stdin can be reserved for the program input
	// Build a shell command that writes the script from a quoted heredoc and then runs it
	safeCmd := "cat > /home/runner/script.py <<'PY'\n" + payload.Content + "\nPY\npython -u /home/runner/script.py"

	ctx, cancel := context.WithTimeout(context.Background(), 6*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "docker", "run", "--rm", "-i", "--network", "none", "--memory", "256m", "--cpus", "0.5", img, "sh", "-lc", safeCmd)
	// Provide user-supplied program input on stdin (if any)
	if payload.Stdin != "" {
		cmd.Stdin = strings.NewReader(payload.Stdin)
	}
	out, err := cmd.CombinedOutput()
	if ctx.Err() == context.DeadlineExceeded {
		json.NewEncoder(w).Encode(InterpretResponse{Success: false, Error: "Execution timed out"})
		return
	}
	if err != nil {
		// include output
		json.NewEncoder(w).Encode(InterpretResponse{Success: false, Error: err.Error(), Output: string(out)})
		return
	}

	// Success
	json.NewEncoder(w).Encode(InterpretResponse{Success: true, Output: string(out)})
}

// Update the editorHandler to properly handle content
func editorHandler(w http.ResponseWriter, r *http.Request) {
	// Auth via JWT
	username, err := authFromJwt(r)
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	sessionID := r.URL.Query().Get("session_id")
	if sessionID == "" {
		http.Error(w, "Session ID required", http.StatusBadRequest)
		return
	}

	// Parse session ID for security check
	sessionIDInt, err := strconv.Atoi(sessionID)
	if err != nil {
		http.Error(w, "Invalid session ID", http.StatusBadRequest)
		return
	}

	// Get session from DB (join users for username)
	var owner, lang, proj, content string
	err = db.QueryRow(`SELECT u.username, s.language, s.project_name, s.content FROM sessions s JOIN users u ON s.owner_id = u.user_id WHERE s.session_id = ?`, sessionIDInt).Scan(&owner, &lang, &proj, &content)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Check if user has access (owner or collaborator)
	if owner != username {
		var collaboratorCount int
		err = db.QueryRow(`SELECT COUNT(*) FROM collabs c 
			JOIN users u ON c.user_id = u.user_id 
			WHERE c.session_id = ? AND u.username = ?`, sessionIDInt, username).Scan(&collaboratorCount)
		if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}
		if collaboratorCount == 0 {
			http.Error(w, "Access denied", http.StatusForbidden)
			return
		}
	}

	session := Session{Owner: owner, Language: lang, ProjectName: proj, Content: content}
	data := struct {
		Username  string
		SessionID string
		Session   Session
		Template  string
	}{
		Username:  username,
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
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Auth via JWT
	username, err := authFromJwt(r)
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}
	sessionID := r.URL.Query().Get("session_id")
	var dbUserID int
	err = db.QueryRow(`SELECT s.owner_id FROM sessions s WHERE s.session_id = ?`, sessionID).Scan(&dbUserID)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "Session not found or access denied", http.StatusForbidden)
		return
	} else if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	// Get user_id for username
	var userID int
	err = db.QueryRow("SELECT user_id FROM users WHERE username = ?", username).Scan(&userID)
	if err != nil || dbUserID != userID {
		http.Error(w, "Session not found or access denied", http.StatusForbidden)
		return
	}
	// Delete session from DB
	_, err = db.Exec("DELETE FROM sessions WHERE session_id = ?", sessionID)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func addCollabHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Auth via JWT
	ownerUsername, err := authFromJwt(r)
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	sessionIDStr := r.FormValue("session_id")
	collabUsername := r.FormValue("username")
	if sessionIDStr == "" || collabUsername == "" {
		http.Error(w, "session_id and username required", http.StatusBadRequest)
		return
	}
	// parse session id
	sessionID, err := strconv.ParseInt(sessionIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid session_id", http.StatusBadRequest)
		return
	}
	// Verify owner: get user_id of session
	var ownerUserID int
	err = db.QueryRow("SELECT owner_id FROM sessions WHERE session_id = ?", sessionID).Scan(&ownerUserID)
	if err == sql.ErrNoRows {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	// get owner username to compare
	var dbOwnerUsername string
	err = db.QueryRow("SELECT username FROM users WHERE user_id = ?", ownerUserID).Scan(&dbOwnerUsername)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	if dbOwnerUsername != ownerUsername {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}
	// find collaborator user_id
	var collabUserID int
	err = db.QueryRow("SELECT user_id FROM users WHERE username = ?", collabUsername).Scan(&collabUserID)
	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusBadRequest)
		return
	} else if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	// insert into collabs (ignore duplicates)
	_, err = db.Exec("INSERT OR IGNORE INTO collabs(session_id, user_id) VALUES (?, ?)", sessionID, collabUserID)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	// Redirect back to editor
	http.Redirect(w, r, fmt.Sprintf("/editor?session_id=%d", sessionID), http.StatusSeeOther)
}
