package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
)

var sessionStore = sessions.NewCookieStore(securecookie.GenerateRandomKey(32))

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// predefined routes
	r.Get("/", s.HelloWorldHandler)
	r.Get("/health", s.RequireAuth(s.healthHandler))

	// Auth routes
	r.Get("/auth/{provider}/callback", s.HandleAuthCallbackFunction)
	r.Get("/auth/{provider}", s.HandleProviderLogin)
	r.Get("/auth/logout/{provider}", s.HandleLogout)
	// Example for a protected route
	// r.Get("/health", s.RequireAuth(s.healthHandler))

	// User routes
	r.Post("/user/create", s.RequireAuth(s.HandleNewUser))

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
	jsonResp, _ := json.Marshal(s.db.Health())
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

	log.Println("User: ", gothUser)

	session, _ := sessionStore.Get(r, "goChat-session")
	session.Values["user"] = gothUser
	session.Save(r, w)

	http.Redirect(w, r, "http://localhost:5173", http.StatusFound)
}

// HandleLogout is used to logout the user of the authentication
func (s *Server) HandleLogout(w http.ResponseWriter, r *http.Request) {
	gothic.Logout(w, r)
	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusTemporaryRedirect)
}

// Auth Middleware to check if the user is logged in.
func (s *Server) RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessionValue, _ := sessionStore.Get(r, "goChat-session")
		_, ok := sessionValue.Values["user"]
		if !ok {
			// the user is not logged in. Redirect to the login page
			http.Redirect(w, r, "http://localhost:3000/auth/google", http.StatusTemporaryRedirect)
			return
		}

		// Authentication complete
		next.ServeHTTP(w, r)
	}
}

// ============================= User Handlers ======================================

func (s *Server) HandleNewUser(w http.ResponseWriter, r *http.Request) {
	sessionVal, _ := sessionStore.Get(r, "goChat-session")
	user, ok := sessionVal.Values["user"].(goth.User)
	if ok {
		s.db.AddNewUser(&user)
	}
}
