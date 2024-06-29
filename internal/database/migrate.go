package database

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"log"
)

func InitDB() {
	// Create a connection
	db, err := sqlx.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, host, port, dbname))
	if err != nil {
		// This will not be a connection error, but a DSN parse error or
		// another initialization error.
		log.Fatalf("Error in creating db connection. Err: %v\n", err)
	}

	query := `
		CREATE TABLE IF NOT EXISTS users(
			uid VARCHAR(40) DEFAULT (uuid()),
			provider VARCHAR(63) NOT NULL,
			email VARCHAR(63) NOT NULL,
			name VARCHAR(127) NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			avatar VARCHAR(255),
			PRIMARY KEY (uid),
			INDEX (provider, email)
		);
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Printf("Error in creating users table. %v\n", err)
		return
	}

	query = `
		CREATE TABLE IF NOT EXISTS channels(
			id INT AUTO_INCREMENT,
			name VARCHAR(63),
			descr VARCHAR(255),
			last_message_ts DATETIME DEFAULT CURRENT_TIMESTAMP,
			uid varchar(40) NOT NULL,
			PRIMARY KEY (id),
			FOREIGN KEY (uid) REFERENCES users(uid),
			INDEX (uid)
		);
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Printf("Error in creating channels table. %v\n", err)
		return
	}

	query = `
		CREATE TABLE IF NOT EXISTS messages(
			id INT AUTO_INCREMENT,
			content BLOB,
			timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
			from_uid varchar(40) NOT NULL,
			channel_id INT,
			PRIMARY KEY (id),
			FOREIGN KEY (from_uid) REFERENCES users(uid),
			FOREIGN KEY (channel_id) REFERENCES channels(id),
			INDEX (channel_id)
		);
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Printf("Error in creating messages table. %v\n", err)
		return
	}

	err = db.Close()
	if err != nil {
		log.Printf("Error in closing db connection %v\n", err)
		return
	}
	log.Printf("Successfully initialized the database")
}
