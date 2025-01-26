let db = null;
const DB_NAME = 'apiCache';
const STORE_NAME = 'responses';
const DB_VERSION = 1;

export async function initializeDatabase() {
  if (db) return db;
  
  return new Promise((resolve, reject) => {
    console.log('Opening database:', DB_NAME);
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      console.log('Database upgrade needed');
      const database = event.target.result;
      
      // Delete existing store if it exists
      if (database.objectStoreNames.contains(STORE_NAME)) {
        database.deleteObjectStore(STORE_NAME);
      }

      // Create new store with indexes
      const store = database.createObjectStore(STORE_NAME, { 
        keyPath: 'id',
        autoIncrement: true 
      });
      
      // Add indexes
      store.createIndex('url', 'url', { unique: false });
      store.createIndex('timestamp', 'timestamp', { unique: false });
      
      console.log('Store and indexes created successfully');
    };
  });
}

export async function storeAPIResponse(url, data) {
  try {
    const database = await initializeDatabase();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const entry = {
      url: String(url),
      data: data,
      timestamp: Date.now()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.add(entry);
      
      request.onsuccess = () => {
        console.log('Response stored successfully');
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error storing response:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error storing response:', error);
    throw error;
  }
}

export function cleanupDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close();
      db = null;
    }

    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

    deleteRequest.onsuccess = () => {
      console.log('Database deleted successfully');
      resolve();
    };

    deleteRequest.onerror = (event) => {
      console.error('Error deleting database:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Add a function to list all stored responses (for debugging)
export async function listAllResponses() {
  try {
    const database = await initializeDatabase();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        console.log('All stored responses:', request.result);
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error listing responses:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error accessing database:', error);
    throw error;
  }
}

export async function getMostRecentResponse() {
  try {
    const database = await initializeDatabase();
    
    return new Promise((resolve, reject) => {
      // Verify store exists
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        reject(new Error('Store not found. Database may need to be reinitialized.'));
        return;
      }

      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      const request = index.openCursor(null, 'prev');
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log('Found cached response:', cursor.value);
          resolve(cursor.value);
        } else {
          console.log('No cached responses found');
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error fetching recent response:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Database access error:', error);
    throw error;
  }
}