import { openDB } from 'idb';

const DB_NAME = 'api-cache-db';
const STORE_NAME = 'api-responses';

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
       // Check if store exists and delete if upgrading
       if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      // Create object store with indexes
      const store = db.createObjectStore(STORE_NAME, { 
        keyPath: ['url', 'method'] 
      });
      
      // Create indexes for efficient querying
      store.createIndex('url', 'url');
      store.createIndex('timestamp', 'timestamp');
      store.createIndex('method', 'method');
      store.createIndex('url-method', ['url', 'method'], { unique: true });
    },
  });
  return db;
};

export const storeAPIResponse = async (responseData) => {
  const db = await initDB();
  const entry = {
    url: responseData.url,
    method: responseData.method,
    timestamp: new Date().getTime(),
    responseData: responseData.data,
    status: responseData.status,
    headers: responseData.headers
  };
  await db.add(STORE_NAME, entry);
};

export const getMostRecentResponse = async (url) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const timestampIndex = store.index('timestamp');
  
  // Get all entries and sort by timestamp
  const entries = await timestampIndex.getAll();
  if (entries.length === 0) return null;
  
  // Return the most recent entry
  return entries.sort((a, b) => b.timestamp - a.timestamp)[0];
};

export const getMostRecentRequestUrl = async () => {
  const db = await initDB();
  const entries = await db.getAll(STORE_NAME);
  return entries.sort((a, b) => b.timestamp - a.timestamp)[0].url;
};

export const getAllResponses = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const clearResponses = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};