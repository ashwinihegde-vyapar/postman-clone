import { openDB } from 'idb';

// Initialize IndexedDB
export async function initializeDatabase() {
  console.log('Initializing database...');
  return openDB('responsesDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('responses')) {
        db.createObjectStore('responses', { keyPath: 'url' });
      }
    },
  });
}

// Save API response
export async function saveResponse(url, data) {
  const db = await initializeDatabase();
  const tx = db.transaction('responses', 'readwrite');
  const store = tx.objectStore('responses');
  await store.put({ url, data, timestamp: Date.now() });
  await tx.done;
}

// Fetch most recent response for a given URL
export async function getMostRecentResponse(url) {
  const db = await initializeDatabase();
  const tx = db.transaction('responses', 'readonly');
  const store = tx.objectStore('responses');
  return await store.get(url); // Returns the most recent response for the URL
}
