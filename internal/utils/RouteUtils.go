package utils

import (
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
)

func CheckAuthorization(w http.ResponseWriter, r *http.Request, sessionStore sessions.CookieStore) *goth.User {
	sessionVal, _ := sessionStore.Get(r, "goChat-session")
	gothUser, ok := sessionVal.Values["user"].(goth.User)
	if !ok {
		http.Redirect(w, r, "http://localhost:3000/auth/google", http.StatusTemporaryRedirect)
		return nil
	}

	return &gothUser
}
