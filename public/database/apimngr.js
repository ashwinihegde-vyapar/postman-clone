var dbmngr = require("./dbmanager");
var db = dbmngr.db;

const createCollection = (name) => {
    const stmt = db.prepare(`INSERT INTO collections (name) VALUES (?)`);
    const result = stmt.run(name);
    return result.lastInsertRowid;
};
  
  // Add a request to a collection
const addRequestToCollection = (collectionId, name, url, method, timestamp) => {
    const stmt = db.prepare(`
      INSERT INTO collection_requests (collection_id, name, url, method, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(collectionId, name, url, method, timestamp);
  };
  
  // Get all collections
const getCollections = () => {
    return db.prepare(`SELECT * FROM collections`).all();
  };
  
const getCollectionName = (id) => {
    return db.prepare(`SELECT name FROM collections WHERE id= ?`).get(id).name;
  };
  

const validateCollectionName = (name) => {
    const c_id = db.prepare(`SELECT id FROM collections WHERE name = ?`).get(name);
    if (c_id) {
        return c_id.id;
    }
    else {
        return 0;
    }
};
  
  // Get all requests in a collection
const getRequestsInCollection = (collectionId) => {
    return db
      .prepare(`SELECT * FROM collection_requests WHERE collection_id = ?`)
      .all(collectionId);
  };

module.exports = { 
    createCollection, 
    addRequestToCollection, 
    getCollections, 
    getRequestsInCollection,
    getCollectionName,
    validateCollectionName
};
