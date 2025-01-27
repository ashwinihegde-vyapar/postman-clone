import React, { useState , useEffect} from 'react';
import './assets/App.css';
import Request from './components/Request.tsx';
import Response from './components/Response.tsx';
import Collection from './components/Collection.tsx';

import { initializeDatabase, cleanupDatabase } from './utils/indexedDb';


const { groupRequestsByTime } = window.api;

const App = () => {
  
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(0);
  const [requests, setRequests] = useState({});
  const [collections, setCollections] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedResponses, setCachedResponses] = useState({});
  const [error, setError] = useState("");


  useEffect(() => {
    const initializeDB = async () => {
      // await cleanupDatabase();
      await initializeDatabase();
      
      // Add cleanup listener
      // window.api.onCleanup(async () => {
      //   try {
      //     await cleanupDatabase();
      //     console.log('IndexedDB cleanup completed');
      //   } catch (error) {
      //     console.error('Error during IndexedDB cleanup:', error);
      //   }
      // });
    };

    initializeDB();

    // Handle online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial data
    updateHistory();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCollectionSelect = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  const updateHistory = async() => {
    const latestRequests = await groupRequestsByTime() || [];
    setRequests(latestRequests);
  };

  return (
    <div className="app-container">
      {!isOnline && (
        <div className="offline-banner">
          You are currently offline! Displaying the cached response.
        </div>
      )}
      
      {/* Display collections on the left */}
      <Collection 
      onSelectCollection={handleCollectionSelect}
      requests={requests}
      setRequests={setRequests}
      collections={collections}
      setCollections={setCollections}
       />
  
        <div className="request-response-container">
          {isOnline &&
          <Request
            setResponse={setResponse}
            setLoading={setLoading}
            selectedCollection={selectedCollection}
            updateHistory={updateHistory}
            collections={collections}
            // setError={setError}
          />
          }
          <Response response={response} loading={loading} error={error} isOnline={isOnline} />
        </div>
    </div>
  );
};

export default App;



// 
// https://jsonplaceholder.typicode.com/todos/
// https://reqres.in/api/users
// https://reqres.in/api/users/1
// https://fakestoreapi.com/products/1
// https://run.mocky.io/v3/b9b36e6a-7d52-4f3e-80d7-d56e1a61801a
// https://www.boredapi.com/api/activity
// https://catfact.ninja/fact
// https://api.chucknorris.io/jokes/random
// https://random-data-api.com/api/users/random_user
// https://random-data-api.com/api/v2/beers
