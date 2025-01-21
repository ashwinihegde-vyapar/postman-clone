import React, { useState } from 'react';
import './App.css';
import Request from './components/Request.tsx';
import Response from './components/Response.tsx';
import Collection from './components/Collection.tsx';

const { groupRequestsByTime } = window.sqlite.apimngr;

const App = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(0);
  const [requests, setRequests] = useState([]);
  const [collections, setCollections] = useState([]);

  const handleCollectionSelect = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  const updateHistory = () => {
    const latestRequests = groupRequestsByTime();
    setRequests(latestRequests);
  };

  return (
    <div className="app-container">
      {/* Display collections on the left */}
      <Collection onSelectCollection={handleCollectionSelect}
      requests={requests}
      setRequests={setRequests}
      collections={collections}
      setCollections={setCollections}
       />
  
        <div className="request-response-container">
          <Request
            setResponse={setResponse}
            setLoading={setLoading}
            selectedCollection={selectedCollection}
            updateHistory={updateHistory}
            collections={collections}
          />
          <Response response={response} loading={loading} />
        </div>
    </div>
  );
};

export default App;