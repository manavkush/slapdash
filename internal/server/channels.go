package server

import (
	"goChat/internal/models"
	"goChat/internal/utils"
	"net/http"
)

var channelIdToUsers = make(map[string]map[string]models.User)
var channelIdToMessages = make(map[string]models.Message)

func (s *Server) LoadChannelFromDB(channelId string) {
	// s.Db.LoadChannel(channelId)
}

// AddUserToChannel adds a user to a channel
func (s *Server) AddUserToChannel(w http.ResponseWriter, r *http.Request) {
	gothUser := utils.CheckAuthorization(w, r, *sessionStore)
	if gothUser == nil {
		return
	}
	// channelId := r.URL.Query().Get("channelId")
	//
	// if users, ok := channelIdToUsers[channelId]; !ok {
	// 	s.LoadChannelFromDB(channelId)
	// }
	// channelIdToUsers[channelId][gothUser.UserID]
}
