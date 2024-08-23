package models

type User struct {
	Name string
	Id   string
}

type Channel struct {
	Name string
	Id   string
}

type ActionType string

const (
	ActionJoinChannel  ActionType = "join-channel"
	ActionLeaveChannel ActionType = "leave-channel"
	ActionSendMessage  ActionType = "leave-channel"
)

type Message struct {
	Text      string
	Type      ActionType
	SenderId  string
	ChannelId string
}
