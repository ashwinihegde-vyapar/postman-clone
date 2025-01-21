import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const { addRequestToCollection, getRequestsInCollection, validateCollectionName, getCollections} = window.sqlite.apimngr;

export default function Request({ setResponse, setLoading, selectedCollection, updateHistory, collections}) {
  const [url, setUrl] = useState("");
  const [reqMethod, setReqMethod] = useState('GET');
  const [collectionName, setCollectionName] = useState("");

  console.log(collectionName);
  const [bodyData, setBodyData] = useState({
    title: '',
    body: '',
    userId: 1,
  });
  const [requests, setRequests] = useState([]);

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
    } catch (e) {
      console.error('Error:', e);
    }
  
    let data = null;
  
    if (reqMethod === 'POST') {
      data = bodyData;
    }
  
    try {
      const response = await axios({
        url: url,
        method: reqMethod,
        data,
      });
  
      setResponse(response);
    } 
    catch (e) {
      console.error('Error:', e);
      setResponse(e);
    }
  
    setLoading(false);
  
    const updatedRequests = getRequestsInCollection(selectedCollection) || [];
    setRequests(updatedRequests);
    console.log(updatedRequests);
    updateHistory();
  };

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
          />
        </div>
  
        <div>
        <label>Collection: </label>
          <select
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="collection-dropdown"
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