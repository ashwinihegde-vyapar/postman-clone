import React, { useState, useEffect } from 'react';
import './collection.css';

const { groupRequestsByTime , deleteCollection, getCollections, getRequestsInCollection, createCollection} = window.sqlite.apimngr;

export default function Collection({ onSelectCollection, requests, setRequests, collections, setCollections}) {

  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [requestsInCollection, setRequestsInCollection] = useState({});
  const [activeTab, setActiveTab] = useState('collection'); 

  useEffect(() => {
    const loadedCollections = getCollections() || [];
    setCollections(loadedCollections);
  }, []);

  useEffect(() => {
    if (selectedCollectionId !== null) {
      const requests = getRequestsInCollection(selectedCollectionId) || [];
      setRequestsInCollection((prev) => ({
        ...prev,
        [selectedCollectionId]: requests,
      }));
    }
  }, [selectedCollectionId]);

  const updateHistory = () => {
      const latestRequests = groupRequestsByTime();
    
      const groupedByDate = latestRequests.reduce((history, request) => {
        const date = new Date(request.timestamp).toLocaleDateString();
        if (!history[date]) history[date] = [];
        history[date].push(request); 
        return history;
      }, {});
    
      setRequests(groupedByDate); 
    };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newId = createCollection(newCollectionName);
    const newCollection = { id: newId, name: newCollectionName };
    setCollections((prev) => [...prev, newCollection]);
    setNewCollectionName('');
  };

  const handleCollectionClick = (collectionId) => {
    setSelectedCollectionId(collectionId);
    onSelectCollection(collectionId);
  };

  const handleDeleteCollection = (collectionId) => {
    deleteCollection(collectionId);
    setCollections((prev) => prev.filter((collection) => collection.id !== collectionId));
  };

  return (
    <div className="sidebar">
      
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          My Collections
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history');
            updateHistory(); 
          }}
        >
          History
        </button>
      </div>

      {/* Collection View */}
      {activeTab === 'collection' && (
        <div>
          <ul>
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="collectionItem"
              >
                <strong>{collection.name}</strong>
              <button className="display-button" onClick={() => handleCollectionClick(collection.id)}>Requests</button>
              <button className="close-button" onClick={() => setSelectedCollectionId(null)}>Close</button>
              <button className="delete-button" onClick={() => handleDeleteCollection(collection.id)}>Delete</button>

              {selectedCollectionId === collection.id && (
                  <ul className="requestList">
                    {requestsInCollection[collection.id]?.map((request) => (
                      <li key={request.id} className="requestItem">
                        <div>
                          {request.method} - {request.url}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>

          <div className="newCollection">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value.toLowerCase())}
              placeholder="New Collection"
              className="input"
            />
            <button onClick={handleCreateCollection} className="button">
              Create
            </button>
          </div>
        </div>
      )}

      {/* History View */}
      {activeTab === 'history' && (
  <div>
    <h3>History</h3>
    {Object.keys(requests).length > 0 ? (
      <div className="history-container">
        {Object.keys(requests).map((date) => (
          <div key={date} className="history-date-group">
            <h4>{date}</h4>
            <ul>
              {requests[date].map((request, index) => (
                <li key={index} className="history-item">
                  <strong>{request.method}</strong> - {request.url}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : (
          <p>No history available.</p>
        )}
      </div>
    )}
    </div>
  );
}