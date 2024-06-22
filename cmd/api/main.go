package main

import (
	"fmt"
	"goChat/internal/auth"
	"goChat/internal/database"
	"goChat/internal/server"
	"log"
)

func main() {
	server := server.NewServer()
	database.InitDB()
	auth.NewAuth()

	log.Printf("Server started listening on %v\n", server.Addr)
	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
