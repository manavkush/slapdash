-- name: create-slapdash-database
CREATE DATABASE IF NOT EXISTS slapdash;

-- name: use-slapdash
USE slapdash;

-- name: create-users-table
CREATE TABLE IF NOT EXISTS users(
	uid INT AUTO_INCREMENT,
	username VARCHAR(63) NOT NULL,
	email VARCHAR(63) NOT NULL UNIQUE,
	name VARCHAR(127) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	avatar VARCHAR(255),
	about VARCHAR(255),
	PRIMARY KEY (uid)	
);

