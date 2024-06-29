package database

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/joho/godotenv/autoload"
	"github.com/markbates/goth"
)

// Service represents a service that interacts with a database.
type Service interface {
	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	Health() map[string]string
	AddNewUser(*goth.User) error
	GetAllUsers() ([]UserInfo, error)
	GetUserChats(string) ([]ChatMetadata, error)
	GetUserId(*goth.User) (string, error)

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close() error
}

type service struct {
	db *sqlx.DB
}

type ChatMetadata struct {
	Id            string    `db:"id"`
	Name          string    `db:"name"`
	LastMessageTS time.Time `db:"last_message_ts"`
}

type UserInfo struct {
	Name     string
	Id       string
	Username string
	Email    string
	Avatar   string
}

var (
	dbname     = os.Getenv("DB_DATABASE")
	password   = os.Getenv("DB_PASSWORD")
	username   = os.Getenv("DB_USERNAME")
	port       = os.Getenv("DB_PORT")
	host       = os.Getenv("DB_HOST")
	dbInstance *service
)

func New() Service {
	// Reuse Connection
	if dbInstance != nil {
		return dbInstance
	}

	// Opening a driver typically will not attempt to connect to the database.
	db, err := sqlx.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, host, port, dbname))
	if err != nil {
		// This will not be a connection error, but a DSN parse error or
		// another initialization error.
		log.Fatal(err)
	}
	db.SetConnMaxLifetime(0)
	db.SetMaxIdleConns(50)
	db.SetMaxOpenConns(50)

	dbInstance = &service{
		db: db,
	}
	return dbInstance
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	err := s.db.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf(fmt.Sprintf("db down: %v", err)) // Log the error and terminate the program
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats (like open connections, in use, idle, etc.)
	dbStats := s.db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Evaluate stats to provide a health message
	if dbStats.OpenConnections > 40 { // Assuming 50 is the max for this example
		stats["message"] = "The database is experiencing heavy load."
	}
	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime or revising the connection usage pattern."
	}

	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close() error {
	log.Printf("Disconnected from database: %s", dbname)
	return s.db.Close()
}

func (s *service) AddNewUser(gothUser *goth.User) error {
	row := s.db.QueryRow("SELECT count(*) FROM users WHERE provider=? AND email=?", gothUser.Provider, gothUser.Email)
	var count int
	err := row.Scan(&count)
	if err != nil {
		log.Printf("Error in checking if the user exists in the database. Err: %v", err)
		return err
	}

	// If the user already exists
	if count == 1 {
		return nil
	}

	// Add the user to the database
	_, err = s.db.Exec("INSERT INTO users (provider, name, email, avatar) values (?, ?, ?, ?)", gothUser.Provider, gothUser.Name, gothUser.Email, gothUser.AvatarURL)
	if err != nil {
		log.Printf("Error in inserting a new user to the database. Err: %v", err)
		return err
	}
	log.Println("Successfully added new user.")

	return nil
}

// Gets the uid of the given user by using provider and email
func (s *service) GetUserId(gothUser *goth.User) (string, error) {
	row := s.db.QueryRow("SELECT uid FROM users WHERE provider=? AND email=?", gothUser.Provider, gothUser.Email)

	var uid string
	if err := row.Scan(uid); err != nil {
		return "", err
	}
	return uid, nil
}

func (s *service) GetUserChats(uid string) ([]ChatMetadata, error) {
	rows, err := s.db.Queryx("SELECT * FROM channels WHERE uid = ? ORDER BY last_message_ts DESC", uid)
	if err != nil {
		log.Println("Error in getting chats from db. Err: ", err)
		return nil, err
	}
	defer rows.Close()

	ChatList := make([]ChatMetadata, 0)
	for rows.Next() {
		var chatMetadata ChatMetadata
		if err := rows.StructScan(&chatMetadata); err != nil {
			log.Println("Error while getting user chats from db. Err: ", err)
			continue
		}
		ChatList = append(ChatList, chatMetadata)
	}

	for rows.Err() != nil {
		return ChatList, err
	}
	return ChatList, nil
}

func (s *service) GetAllUsers() ([]UserInfo, error) {
	rows, err := s.db.Query("SELECT name, uid, email, username, avatar FROM users")
	if err != nil {
		log.Println("Error in getting all users. Err: ", err)
		return nil, err
	}
	defer rows.Close()

	usersList := make([]UserInfo, 0)
	for rows.Next() {
		var userInfo UserInfo
		if err := rows.Scan(&userInfo.Name, &userInfo.Id, &userInfo.Email, &userInfo.Username, &userInfo.Avatar); err != nil {
			return usersList, err
		}
		usersList = append(usersList, userInfo)
	}
	if err := rows.Err(); err != nil {
		return usersList, err
	}

	return usersList, nil
}
