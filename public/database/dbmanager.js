const Database = require('better-sqlite3');
const path = require('path');

// Define database path
const dbPath =
  process.env.NODE_ENV === 'development'
    ? './mydb.db'
    : path.join(process.resourcesPath, './mydb.db');

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// db.prepare('DROP TABLE IF EXISTS collections').run();
// db.prepare('DROP TABLE IF EXISTS collection_requests').run();

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS collection_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    method TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_DATE,
    FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE,
    UNIQUE (collection_id, url, method)
  );
`).run();

async function createCollection(name) {
  try {
    const stmt = db.prepare(
      'INSERT INTO collections (name) VALUES (?)'
    );
    const result = stmt.run(name)
    return result.lastID; // Make sure this is being returned
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
}

async function addRequestToCollection(collectionId, name, url, method, timestamp) {
  const stmt = db.prepare(`
    INSERT INTO collection_requests (collection_id, name, url, method, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(collectionId, name, url, method, timestamp);
}

async function getCollections() {
  return db.prepare(`SELECT * FROM collections`).all();
}

async function getCollectionName(id) {
  const stmt = db.prepare(`SELECT name FROM collections WHERE id= ?`);
  const result = stmt.get(id);
  return result.name;
} 

async function getRequestsInCollection(collectionId) {
  return db.prepare(`SELECT * FROM collection_requests WHERE collection_id = ?`).all(collectionId);
}

async function groupRequestsByTime() {
  return db.prepare(`SELECT * FROM collection_requests GROUP BY timestamp`).all();
} 

async function validateCollectionName(name) {
  const collection = db.prepare(`SELECT id FROM collections WHERE name = ?`).get(name.toLowerCase());
  return collection ? collection.id : 0;
} 

async function deleteCollection(collectionId) {
  db.prepare(`DELETE FROM collections WHERE id = ?`).run(collectionId);
}

module.exports = {   
  createCollection,
  addRequestToCollection,
  getCollections,
  getCollectionName,
  getRequestsInCollection,
  groupRequestsByTime,
  validateCollectionName,
  deleteCollection  
};


