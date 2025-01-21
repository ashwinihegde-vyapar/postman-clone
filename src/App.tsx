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
