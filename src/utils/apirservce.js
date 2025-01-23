import { saveResponse, getMostRecentResponse } from './indexedDb';

export async function fetchWithCache(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Save the response in IndexedDB
    await saveResponse(url, data);

    return data;
  } catch (error) {
    console.warn('Fetch failed, trying to fetch from cache:', error);

    // Fetch the most recent response from IndexedDB if offline
    const cachedResponse = await getMostRecentResponse(url);
    if (cachedResponse) {
      console.log('Using cached response:', cachedResponse);
      return cachedResponse.data;
    } else {
      throw new Error('No cached response available.');
    }
  }
}
