import React, { useState, useEffect } from 'react';

export default function Collection({ onSelectCollection }) {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [requestsInCollection, setRequestsInCollection] = useState({});

  // Fetch collections and requests when the component loads
  useEffect(() => {
    const loadedCollections = window.sqlite.apimngr?.getCollections() || [];
    setCollections(loadedCollections);
  }, []);

  useEffect(() => {
    if (selectedCollectionId !== null) {
      // Fetch the requests for the selected collection
      console.log("in collection", selectedCollectionId);
      const requests = window.sqlite.apimngr?.getRequestsInCollection(selectedCollectionId) || [];
      setRequestsInCollection((prev) => ({
        ...prev,
        [selectedCollectionId]: requests,
      }));
      console.log(requests);
    }
  }, [selectedCollectionId]);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newId = window.sqlite.apimngr?.createCollection(newCollectionName);
    const newCollection = { id: newId, name: newCollectionName };
    setCollections((prev) => [...prev, newCollection]);
    setNewCollectionName('');
  };

  const handleCollectionClick = (collectionId) => {
    console.log("in collection", collectionId);
    setSelectedCollectionId(collectionId);
    onSelectCollection(collectionId); // Pass the selected collection ID to the parent
  };

  return (
    <div style={styles.sidebar}>
      <h3>Collections</h3>
      <ul>
        {collections.map((collection) => (
          <li
            key={collection.id}
            onClick={() => handleCollectionClick(collection.id)}
            style={styles.collectionItem}
          >
            <strong>{collection.name}</strong>

            {/* Display requests if the collection is selected */}
            {selectedCollectionId === collection.id && (
              <ul style={styles.requestList}>
                {requestsInCollection[collection.id]?.map((request) => (
                  <li key={request.id} style={styles.requestItem}>
                    <div>{request.name}</div>
                    <div>{request.method} - {request.url}</div>
                    <div>{new Date(request.timestamp).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div style={styles.newCollection}>
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New Collection"
          style={styles.input}
        />
        <button onClick={handleCreateCollection} style={styles.button}>
          Add
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '20%',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #ddd',
    height: '100vh',
    overflowY: 'auto',
  },
  collectionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
  },
  newCollection: {
    marginTop: '20px',
  },
  input: {
    width: '80%',
    padding: '5px',
  },
  button: {
    marginLeft: '5px',
    padding: '5px 10px',
  },
  requestList: {
    paddingLeft: '20px',
    marginTop: '10px',
  },
  requestItem: {
    padding: '5px',
    borderBottom: '1px solid #ddd',
  },
};
