package storage

import (
	"context"
	"database/sql"
	"errors"

	_ "modernc.org/sqlite"
)

type Database struct {
	DB *sql.DB
}

var DB Database


func (db *Database) ExecQuery(query string) (*sql.Result, error) {
	res, err := db.DB.Exec(query)
	return &res, err
}

func InitDB() (error) {
	var ctx context.Context = context.Background()
	var err error

	DB.DB, err = sql.Open("sqlite", ":memory:") // :memory: -> ./database.db
	if err != nil {
		return err
	}

	tableDefs := []string{
		"CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)",
		"CREATE TABLE IF NOT EXISTS test_cases (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, case_number INTEGER NOT NULL, case_settings TEXT, case_result TEXT)",
	}
	err = prepareTables(ctx, DB.DB, tableDefs)
	
	return err
}

func prepareTables(ctx context.Context, db *sql.DB, tableDefinitions []string) error {
	if db == nil {
		return errors.New("error, db is nil")
	}
	var err error = nil

	for i := 0; i < len(tableDefinitions); i++ {
		_, err = db.ExecContext(ctx, tableDefinitions[i])
	}

	return err
}