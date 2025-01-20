import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const { addRequestToCollection, getRequestsInCollection } = window.sqlite.apimngr;

export default function Request({ setResponse, setLoading }) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [name, setName] = useState('default');
  const [reqMethod, setReqMethod] = useState('GET');
  const [bodyData, setBodyData] = useState({
    title: '',
    body: '',
    userId: 1,
  });
  const [requests, setRequests] = useState([]);

  // Fetch requests for the selected collection
  // useEffect(() => {
  //   if (selectedCollection) {
  //     const loadedRequests = getRequestsInCollection(selectedCollection) || [];
  //     setRequests(loadedRequests);
  //   }
  // }, [selectedCollection]);

  const handleOnInputSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   // Save the request to the selected collection
    //   addRequestToCollection(name.id, name, url, reqMethod);
    // } catch (e) {
    //   console.error('Error:', e);
    // }

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
    } catch (e) {
      console.error('Error:', e);
      setResponse(e);
    }

    setLoading(false);

    // Refresh the list of requests
    const updatedRequests = getRequestsInCollection(name) || [];
    setRequests(updatedRequests);
  };

  return (
    <div className="request-manager">
      <form onSubmit={handleOnInputSend} className="request-form">
        <h2>Send</h2>
        <div>
          <label>API URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label>Collection Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        {/* <h2>Requests in Collection</h2> */}
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
