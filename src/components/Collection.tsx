import React, { useState, useEffect } from 'react';

export default function Collection({ onSelectCollection }) {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const loadedCollections = window.sqlite.apimngr?.getCollections() || [];
    setCollections(loadedCollections);
  }, []);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newId = window.sqlite.apimngr?.createCollection(newCollectionName);
    setCollections([...collections, { id: newId, name: newCollectionName }]);
    setNewCollectionName('');
  };

  return (
    <div style={styles.sidebar}>
      <h3>Collections</h3>
      <ul>
        {collections.map((collection) => (
          <li
            key={collection.id}
            onClick={() => onSelectCollection(collection.id)}
            style={styles.collectionItem}
          >
            {collection.name}
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
};
