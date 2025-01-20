import React, { useState } from 'react';
import './App.css';
import Request from './components/Request.tsx';
import Response from './components/Response.tsx';
import Collection from './components/Collection.tsx';

const App = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(1);

  const handleCollectionSelect = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  return (
    <div className="app-container">
      {/* Display collections on the left */}
      <Collection onSelectCollection={handleCollectionSelect} />
  
        <div className="request-response-container">
          <Request
            setResponse={setResponse}
            setLoading={setLoading}
            selectedCollection={selectedCollection}
          />
          <Response response={response} loading={loading} />
        </div>
    </div>
  );
};

export default App;