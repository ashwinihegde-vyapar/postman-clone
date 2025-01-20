import React, { useState, useEffect } from 'react';

export default function RequestManager({ collectionId }) {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ name: '', url: '', method: 'GET' });

  useEffect(() => {
    if (collectionId) {
      const loadedRequests = window.sqlite.apimngr?.getRequestsInCollection(collectionId) || [];
      setRequests(loadedRequests);
    }
  }, [collectionId]);

  const handleAddRequest = () => {
    const { name, url, method } = newRequest;
    if (!name || !url) return;

    window.sqlite.apimngr?.addRequestToCollection(collectionId, name, url, method, '{}', '{}');
    setRequests([...requests, { ...newRequest, id: Date.now(), timestamp: new Date().toISOString() }]);
    setNewRequest({ name: '', url: '', method: 'GET' });
  };

  return (
    <div style={styles.manager}>
      <h3>Requests</h3>
      <ul style={styles.requestList}>
        {requests.map((request) => (
          <li key={request.id} style={styles.requestItem}>
            <div>{request.name}</div>
            <div>{request.method} {request.url}</div>
            <div>{new Date(request.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <div style={styles.newRequest}>
        <input
          type="text"
          placeholder="Request Name"
          value={newRequest.name}
          onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Request URL"
          value={newRequest.url}
          onChange={(e) => setNewRequest({ ...newRequest, url: e.target.value })}
          style={styles.input}
        />
        <select
          value={newRequest.method}
          onChange={(e) => setNewRequest({ ...newRequest, method: e.target.value })}
          style={styles.select}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        <button onClick={handleAddRequest} style={styles.button}>
          Add Request
        </button>
      </div>
    </div>
  );
}

const styles = {
  manager: {
    width: '80%',
    padding: '20px',
  },
  requestList: {
    listStyle: 'none',
    padding: 0,
  },
  requestItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  newRequest: {
    marginTop: '20px',
  },
  input: {
    width: '30%',
    marginRight: '10px',
    padding: '5px',
  },
  select: {
    marginRight: '10px',
    padding: '5px',
  },
  button: {
    padding: '5px 10px',
  },
};
