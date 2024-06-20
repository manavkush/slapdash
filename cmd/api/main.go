package main

import (
	"fmt"
	"goChat/internal/auth"
	"goChat/internal/server"
)

func main() {

	server := server.NewServer()
	auth.NewAuth()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
