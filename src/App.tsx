import React, { useState, } from 'react';
import './App.css';

import Request from './components/Request.tsx';
import Response from './components/Response.tsx';
import Collection from './components/Collection.tsx';

const App = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  return (
    <div className="app-container">
      {/* Sidebar for Collections */}
      {/* <div className="sidebar">
        <Collection onSelectCollection={setSelectedCollection} />

      </div>
      <div className="main-content"> */}
        <Request
          setResponse={setResponse}
          setLoading={setLoading}
          // selectedCollection={selectedCollection}
        />
        <Response response={response} loading={loading} />
      </div>
    // </div>
  );
};


export default App;

