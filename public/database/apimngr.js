var dbmngr = require("./dbmanager");
var db = dbmngr.db;

const createCollection = (name) => {
    const stmt = db.prepare(`INSERT INTO collections (name) VALUES (?)`);
    const result = stmt.run(name);
    return result.lastInsertRowid;
};
  
  // Add a request to a collection
const addRequestToCollection = (collectionId, name, url, method) => {
    const stmt = db.prepare(`
      INSERT INTO collection_requests (collection_id, name, url, method)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(collectionId, name, url, method);
  };
  
  // Get all collections
const getCollections = () => {
    return db.prepare(`SELECT * FROM collections`).all();
  };
  
  // Get all requests in a collection
const getRequestsInCollection = (name) => {
    return db
      .prepare(`SELECT * FROM collection_requests WHERE name = ?`)
      .all(name);
  };

module.exports = { 
    createCollection, 
    addRequestToCollection, 
    getCollections, 
    getRequestsInCollection
};
