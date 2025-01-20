const Database = require("better-sqlite3")
const path = require("path")

const dbPath =
    process.env.NODE_ENV === "development"
        ? "./mydb.db"
        : path.join(process.resourcesPath, "./mydb.db")

const db = new Database(dbPath)
db.pragma("journal_mode = WAL")


// Create tables if they don't exist
// db.prepare(`drop table if exists collections`).run();
// db.prepare(`drop table if exists collection_requests`).run();

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
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE,
    UNIQUE (collection_id, url, method)
  );
`).run();

// const insertTestData = () => {
//   const insertCollection = db.prepare("INSERT INTO collections (name) VALUES (?)");
//   insertCollection.run("collection 1");

// };

// // Run the function to insert test data
// insertTestData();

const getCollections = db.prepare("SELECT * FROM collections").all();
console.log("Collections:", getCollections);

const getRequests = db.prepare("SELECT * FROM collection_requests").all();
console.log("Requests:", getRequests);


module.exports = { db };
