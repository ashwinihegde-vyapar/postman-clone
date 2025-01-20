const Database = require("better-sqlite3")
const path = require("path")

const dbPath =
    process.env.NODE_ENV === "development"
        ? "./mydb.db"
        : path.join(process.resourcesPath, "./mydb.db")

const db = new Database(dbPath)
db.pragma("journal_mode = WAL")

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS collection_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    method TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE
  );
`).run();

module.exports = { db };
