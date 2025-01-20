import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file
// import compilerRuntime from 'react/compiler-runtime';

const { addRequestToCollection, getRequestsInCollection, getCollectionName} = window.sqlite.apimngr;

export default function Request({ setResponse, setLoading, selectedCollection }) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [reqName, setReqName] = useState("");
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
  
    const timestamp = new Date().toISOString(); // Get the current timestamp

    try {
      addRequestToCollection(selectedCollection, collectionName, url, reqMethod, timestamp); // Save the request with timestamp
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
  };

  return (
    <div className="request-manager">
      <form onSubmit={handleOnInputSend} className="request-form">
        <h2>Create or Send Request</h2>
        <div>
          <label>API URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
  
        <div>
          <label>Request Name</label>
          <input
            type="text"
            value={reqName}
            placeholder="type your request name"
            onChange={(e) => setReqName(e.target.value)}
          />
        </div>

        <div>
          <label>Collection Name</label>
          <input
            type="text"
            value={collectionName}
            placeholder="type your collection name"
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
  
        <div>
          <label>Request Method</label>
          <select
            value={reqMethod}
            onChange={(e) => setReqMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
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
  
      <div className="request-list">
        {requests.length > 0 && <h2>Requests in Collection</h2>}
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="request-item">
              <strong>{request.name}</strong>
              <div>Method: {request.method}</div>
              <div>URL: {request.url}</div>
              <div>Date: {new Date(request.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}