import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import '../assets/styles.css';
import { addToHistory } from '../reducers/historySlice';
import { setResponse } from '../reducers/responseSlice';

const { addRequestToCollection, getRequestsInCollection, validateCollectionName } = window.api;

export default function Request({ setLoading, updateHistory, setRequestsInCollection }) {
  const dispatch = useDispatch();
  const selectedCollection = useSelector((state: any) => state.collections.selectedCollection);
  const collections = useSelector((state: any) => state.collections.items);

  const [url, setUrl] = useState("");
  const [reqMethod, setReqMethod] = useState('GET');
  const [collectionName, setCollectionName] = useState("");
  const [error, setError] = useState("");
  const [bodyData, setBodyData] = useState({
    title: '',
    body: '',
    userId: 1,
  });

  useEffect(() => {
    const loadrequests = async() => {
      if (selectedCollection) {
        const loadedRequests = await getRequestsInCollection(selectedCollection) || [];
        console.log(loadedRequests);
      }
    }
    loadrequests();
  }, [selectedCollection]);

  const handleOnInputSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const timestamp = new Date().toISOString(); 

    try {
      const collection_id = await validateCollectionName(collectionName);
      if(collection_id) {
        await addRequestToCollection({
          collectionId: collection_id,
          name: collectionName,
          url: url,
          method: reqMethod,
          timestamp: timestamp
        });
        setRequestsInCollection((prev: any) => ({
          ...prev,
          [collection_id]: [...(prev[collection_id] || []), {
            url,
            method: reqMethod,
            timestamp: new Date().toISOString()
          }]
        }));
      }   
    } catch (e) {
      setError("Error: URL already exists in collection");
    }

    try {
      const res = await axios({
        url,
        method: reqMethod,
        data: reqMethod === '' ? bodyData : null,
      });

      dispatch(setResponse(res));
      setLoading(false);

      const date = new Date().toLocaleDateString();
      dispatch(addToHistory({
        date,
        request: {
          url,
          method: reqMethod,
          timestamp: new Date().toISOString()
        }
      }));

      updateHistory();
    } catch (e) {
      console.error('Error:', e);
      setLoading(false);
    }
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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
