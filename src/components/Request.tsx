import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { storeAPIResponse, getMostRecentResponse } from '../indexedDb';
;

  
const { addRequestToCollection, getRequestsInCollection, validateCollectionName} = window.sqlite.apimngr;

export default function Request({ setResponse, setLoading, selectedCollection, updateHistory, collections, setError}) {
  const [url, setUrl] = useState("");
  const [reqMethod, setReqMethod] = useState('GET');
  const [collectionName, setCollectionName] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [bodyData, setBodyData] = useState({
    title: '',
    body: '',
    userId: 1,
  });

  const [requests, setRequests] = useState({});


  useEffect(() => {
    if (selectedCollection) {
      const loadedRequests = getRequestsInCollection(selectedCollection) || [];
      console.log(loadedRequests);
      setRequests(loadedRequests);
    }

  }, [selectedCollection]);

  const handleOnInputSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    const timestamp = new Date().toISOString(); 

    try {
      const collection_id = validateCollectionName(collectionName);
      if (collection_id) {
        addRequestToCollection(collection_id, collectionName, url, reqMethod, timestamp);
      }

        const res = await axios({
          url,
          method: reqMethod,
          data: reqMethod === 'POST' ? bodyData : null,
        });

        // Store response in IndexedDB
        await storeAPIResponse({
          url,
          method: reqMethod,
          data: res.data,
          status: res.status,
          headers: res.headers
        });

        setResponse(res);
        setLoading(false);

        const updatedRequests = getRequestsInCollection(selectedCollection) || [];
        setRequests(updatedRequests);
        updateHistory();
      }

    catch (e) {
      console.error('Error:', e);
      setError("Error: URL already exists in collection");
      setLoading(false);
    }
  }
  
  return (
    <div className="request-manager">
      <form onSubmit={handleOnInputSend} className="request-form">
        <h2>Create or Send Request</h2>

        <div>
          <label>Method: </label>
          <select
            value={reqMethod}
            onChange={(e) => setReqMethod(e.target.value)}
            className="request-method"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <div>
          <label>API URL: </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL"
            required={true}
          />
        </div>
  
        <div>
        <label>Collection: </label>
          <select
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="collection-dropdown"
            required={true}
          >
            <option value="" disabled>
              Select a collection
            </option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.name}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
  
        {reqMethod === 'POST' && (
          <>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={bodyData.title}
                onChange={(e) =>
                  setBodyData({ ...bodyData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label>Body</label>
              <textarea
                value={bodyData.body}
                onChange={(e) =>
                  setBodyData({ ...bodyData, body: e.target.value })
                }
              />
            </div>
          </>
        )}
  
        <button type="submit">Send Request</button>
      </form>
    </div>
  );
}
