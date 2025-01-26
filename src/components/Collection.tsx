import React, { useState, useEffect } from 'react';
import './collection.css';

const { getCollections, getRequestsInCollection, createCollection, 
  deleteCollection, groupRequestsByTime, addRequestToCollection, getCollectionName } = window.api;

export default function Collection({ onSelectCollection, requests, setRequests, collections, setCollections}) {

  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [requestsInCollection, setRequestsInCollection] = useState({});
  const [activeTab, setActiveTab] = useState('collection'); 
  const [showAddForm, setShowAddForm] = useState({});
  const [newRequest, setNewRequest] = useState({
    url: '',
    method: 'GET'
  });

  useEffect(() => {
    const loadCollections = async () => {
      const loadedCollections = await getCollections() || [];
      setCollections(loadedCollections);
      console.log(loadedCollections);
    };
    loadCollections();
  }, []);

  useEffect(() => {
    const loadRequests = async () => {
      console.log(selectedCollectionId);
      if (selectedCollectionId !== null) {
        const requests = await getRequestsInCollection(selectedCollectionId) || [];
        console.log(requests);
        setRequestsInCollection((prev) => ({
        ...prev,
        [selectedCollectionId]: requests,
      }));
      }
    };
    loadRequests();
  }, [selectedCollectionId]);

  const updateHistory = async() => {
      const latestRequests = await groupRequestsByTime();
    
      const groupedByDate = latestRequests.reduce((history, request) => {
        const date = new Date(request.timestamp).toLocaleDateString();
        if (!history[date]) history[date] = [];
        history[date].push(request); 
        return history;
      }, {});
    
      setRequests(groupedByDate); 
    };

  const handleCreateCollection = async() => {
    if (!newCollectionName.trim()) return;
    try {
      const newId = await createCollection(newCollectionName);
      const newCollection = { id: newId, name: newCollectionName };
      setCollections((prev) => [...prev, newCollection]);
      setNewCollectionName('');
      console.log(newCollection);
    }
    catch (e) {
      console.log(e);
    }
  };

  const handleCollectionClick = (collectionId) => {
    setSelectedCollectionId(collectionId);
    onSelectCollection(collectionId);
  };

  const handleDeleteCollection = async(collectionId) => {
    await deleteCollection(collectionId);
    setCollections((prev) => prev.filter((collection) => collection.id !== collectionId));
  };

  const handleAddRequest = async (collectionId) => {
    const collection_name = await getCollectionName(collectionId);
    console.log(collection_name);
    try {
      await addRequestToCollection({
        collectionId,
        name: collection_name,
        url: newRequest.url,
        method: newRequest.method,
        timestamp: new Date().toISOString()
      });

      // Refresh the requests for this collection
      const updatedRequests = await getRequestsInCollection(collectionId);
      setRequestsInCollection((prev) => ({
        ...prev,
        [collectionId]: updatedRequests,
      }));

      // Reset form
      setNewRequest({ url: '', method: 'GET' });
      setShowAddForm((prev) => ({
        ...prev,
        [collectionId]: false
      }));
    } catch (error) {
      console.error('Error adding request:', error);
    }
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
              <button className="add-button" onClick={() => setShowAddForm(prev => ({
                  ...prev,
                  [collection.id]: !prev[collection.id]
                }))}>
                  Add Request
              </button>
              <button className="delete-button" onClick={() => handleDeleteCollection(collection.id)}>Delete</button>

              {showAddForm[collection.id] && (
                  <div className="add-request-form">
                    <select
                      value={newRequest.method}
                      onChange={(e) => setNewRequest(prev => ({
                        ...prev,
                        method: e.target.value
                      }))}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter API URL"
                      value={newRequest.url}
                      onChange={(e) => setNewRequest(prev => ({
                        ...prev,
                        url: e.target.value
                      }))}
                    />
                    <button onClick={() => handleAddRequest(collection.id)}>Save</button>
                  </div>
                )}

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
            {Object.keys(requests).map((date) => (
            <div key={date} className="history-date-group">
            <h4>{date}</h4>
              <ul>
                {Array.isArray(requests[date]) ? requests[date].map((request) => (
                  <li key={`${request.id || request.timestamp}-${request.url}`} className="history-item">
                    <strong>{request.method}</strong> - {request.url}
                  </li>
                )) : null}
              </ul>
            </div>
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