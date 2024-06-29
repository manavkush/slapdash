package server

import (
	"context"
	"encoding/json"
	"goChat/internal/utils"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"github.com/markbates/goth/gothic"
)

var sessionStore = sessions.NewCookieStore(securecookie.GenerateRandomKey(32))

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use()

	// predefined routes
	r.Get("/", s.HelloWorldHandler)
	r.Get("/health", s.healthHandler)

	// Auth routes
	r.Get("/auth/{provider}/callback", s.HandleAuthCallbackFunction)
	r.Get("/auth/{provider}", s.HandleProviderLogin)
	r.Get("/auth/logout/{provider}", s.HandleLogout)
	// Example for a protected route
	// r.Get("/health", s.RequireAuth(s.healthHandler))

	// User routes
	r.Get("/getUser", s.GetUserData)
	r.Get("/user/create", s.RequireAuth(s.HandleNewUser))

	// Chat routes
	r.Get("/chats", s.RequireAuth(s.GetUserChats))

	return r
}

// ============================ Predefined Handlers ====================================

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.Db.Health())
	_, _ = w.Write(jsonResp)
}

// =========================== Auth Handlers ===========================================

// HandleProviderLogin initiates the oauth process.
// If the user is not already logged in, it triggers the authentication process.
func (s *Server) HandleProviderLogin(w http.ResponseWriter, r *http.Request) {
	// try to get the user without re-authenticating
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), "provider", provider))

	if gothUser, err := gothic.CompleteUserAuth(w, r); err == nil {
		log.Printf("User already authenticated: %v\n", gothUser)
	} else {
		gothic.BeginAuthHandler(w, r)
	}
}

// HandleAuthCallbackFunction is the function that's called after the authentication is done.
// It's used to get the user information about the user
func (s *Server) HandleAuthCallbackFunction(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), "provider", provider))

	gothUser, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		log.Println("Error in complete user Auth: ", w, err)
		return
	}

	session, _ := sessionStore.Get(r, "goChat-session")
	session.Values["user"] = gothUser
	session.Save(r, w)

	// s.HandleNewUser(w, r)
	http.Redirect(w, r, "/user/create", http.StatusFound)
}

// HandleLogout is used to logout the user of the authentication
func (s *Server) HandleLogout(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), "provider", provider))

	err := gothic.Logout(w, r)
	if err != nil {
		log.Println("Error in logging out the user. Err: ", err)
		return
	}

	sessionValue, _ := sessionStore.Get(r, "goChat-session")
	sessionValue.Values["user"] = nil
	sessionValue.Options.MaxAge = -1

	err = sessionValue.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "http://localhost:5173", http.StatusTemporaryRedirect)
	// w.Header().Set("Location", "/")
	// w.WriteHeader(http.StatusTemporaryRedirect)
}

// Auth Middleware to check if the user is logged in.
func (s *Server) RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessionValue, _ := sessionStore.Get(r, "goChat-session")
		_, ok := sessionValue.Values["user"]
		if !ok {
			log.Println("User not logged in. Redirecting to the auth page.")
			// the user is not logged in. Redirect to the login page
			http.Redirect(w, r, "/auth/google", http.StatusTemporaryRedirect)
			return
		}

		// Authentication complete
		next.ServeHTTP(w, r)
	}
}

/*
Sends the response in the form of following json:

	{
		error: "0"
		msg: ""
		user: ""
	}
*/
func (s *Server) GetUserData(w http.ResponseWriter, r *http.Request) {
	sessionValue, _ := sessionStore.Get(r, "goChat-session")
	user, ok := sessionValue.Values["user"]

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	resp := map[string]string{}
	if (!ok) || (user == nil) {
		resp["error"] = "1"
		resp["msg"] = "Unable to find the session cookie. User needs to sign-in."
		err := json.NewEncoder(w).Encode(resp)
		if err != nil {
			log.Printf("Response encode error: %v\n", err)
		}
		return
	}
	userStr, err := json.Marshal(user)
	if err != nil {
		log.Println("Error in marshalling user. err: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	resp["user"] = string(userStr)
	resp["error"] = "0"
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Printf("Response encode error: %v\n", err)
	}
}

// ============================= User Handlers ======================================

// HandleNewUser handles creation of user.
// The user is added to the database if he logs in for the first time.
func (s *Server) HandleNewUser(w http.ResponseWriter, r *http.Request) {
	gothUser := utils.CheckAuthorization(w, r, *sessionStore)
	err := s.Db.AddNewUser(gothUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error in creating new user."))
		return
	}
	// w.Write([]byte("Successfully created new user."))
	http.Redirect(w, r, "http://localhost:5173", http.StatusTemporaryRedirect)
}

func (s *Server) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	// Check for user authorization
	_ = utils.CheckAuthorization(w, r, *sessionStore)

	userList, err := s.Db.GetAllUsers()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error in getting all users"))
		return
	}

	json.NewEncoder(w).Encode(userList)
}

// ============================= Chat Handlers ======================================

func (s *Server) GetUserChats(w http.ResponseWriter, r *http.Request) {
	// Check for user authorization
	gothUser := utils.CheckAuthorization(w, r, *sessionStore)
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	// Extract the uid
	uid, err := s.Db.GetUserId(gothUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error in getting user id"))
	}

	// Get the user chats
	userChats, err := s.Db.GetUserChats(uid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error in getting all users"))
		return
	}
	log.Println("User Chats: ", userChats)

	data := map[string]any{
		"status":    "0",
		"userChats": userChats,
	}
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Println("Error in marshalling jsonData. Err: ", err)
		http.Error(w, err.Error(), 500)
		return
	}
	w.Write(jsonData)
}
