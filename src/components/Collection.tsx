import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../assets/collection.css';
import { setCollections, setSelectedCollection} from '../reducers/collectionsSlice';
import { setRequests } from '../reducers/requestsSlice';
import { setHistory } from '../reducers/historySlice';

const { getCollections, getRequestsInCollection, createCollection, 
  deleteCollection, groupRequestsByTime, addRequestToCollection, getCollectionName } = window.api;

export default function Collection({ onSelectCollection, requestsInCollection, setRequestsInCollection }) {

  const dispatch = useDispatch();
  const requests = useSelector((state:any) => state.requests.items)
  const collections = useSelector((state:any) => state.collections.items)
  const selectedCollectionId = useSelector((state:any) => state.collections.selectedCollection)
  const history = useSelector((state:any) => state.history.items)

  const [newCollectionName, setNewCollectionName] = useState('');
  const [activeTab, setActiveTab] = useState('collection'); 
  const [showAddForm, setShowAddForm] = useState({});
  const [newRequest, setNewRequest] = useState({
    url: '',
    method: 'GET'
  });

  useEffect(() => {
    const loadCollections = async () => {
      const loadedCollections = await getCollections() || [];
      dispatch(setCollections(loadedCollections));
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
    
    // Create a map to store the latest request for each URL
    const uniqueRequests = latestRequests.reduce((map, request) => {
      map.set(request.url, request);
      return map;
    }, new Map());

    // Convert back to array and group by date
    const groupedByDate = Array.from(uniqueRequests.values()).reduce((history: any, request: any) => {
      const date = new Date(request.timestamp).toLocaleDateString();
      if (!history[date]) history[date] = [];
      history[date].push(request); 
      return history;
    }, {});

    dispatch(setHistory(groupedByDate));
  };

  const handleCreateCollection = async() => {
    if (!newCollectionName.trim()) return;
    try {
      const newId = await createCollection(newCollectionName);
      const newCollection = { id: newId, name: newCollectionName };
      // setCollections((prev) => [...prev, newCollection]);
      dispatch(setCollections([...collections, newCollection]));
      setNewCollectionName('');
      console.log(newCollection);
    }
    catch (e) {
      console.log(e);
    }
  };

  const handleCollectionClick = (collectionId) => {
    dispatch(setSelectedCollection(collectionId));
    onSelectCollection(collectionId);
  };

  const handleDeleteCollection = async(collectionId) => {
    await deleteCollection(collectionId);
    // setCollections((prev) => prev.filter((collection) => collection.id !== collectionId));
    dispatch(setCollections(collections.filter((collection) => collection.id !== collectionId)));
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
    {Object.keys(history).length > 0 ? (
      <div className="history-container">
        {Object.entries(history).map(([date, requests]) => (
          <div key={date} className="history-date-group">
            <h4>{date}</h4>
            <ul>
              {Array.isArray(requests) && requests.map((request: any) => (
                <li key={`${request.timestamp}-${request.url}`} className="history-item">
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