import React, { useState, useEffect, cache } from 'react';
import './styles.css';  
import { getMostRecentResponse, getMostRecentRequestUrl } from '../indexedDb';

export default function Response({ response, loading, isOnline, error }) {
  const [doc, setDoc] = useState('{}');
  const [cachedResponse ,setCachedResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      
      if(isOnline) {
        try {
          const jsonResponse = JSON.stringify(response.data, null, 2);
          setDoc(jsonResponse);
        }
        catch {
            setDoc('{}');
        }
      }
      else {
        try {
          const cachedResponse = await getMostRecentResponse();
          setCachedResponse(cachedResponse);
          if (cachedResponse) {
            const responseData = JSON.stringify(cachedResponse, null, 2);
            console.log(responseData);
            setDoc(responseData);
          }
        } catch (err) {
          console.error('Error fetching cached response:', err);
          setDoc('No cached response available');
        }
      }
    } ; 

    fetchData();
  }, [response, loading]);

  const hasResponse = !(response == null);

  let status = '';
  if (error) {
    setDoc(error);
  }

  else if (hasResponse) {
    status = response.status;
  }

  const RenderedResponseMeta = () => (
    <div className="response-meta">
      <span>Status: {status}</span>
    </div>
  );

  return (
    <div className="response">
      {cachedResponse ? 
      <span className="response-title">Cached Response:</span>  :
      <span className="response-title">Response:</span>
      }
      {hasResponse ? <RenderedResponseMeta /> : null}
      <pre>{doc}</pre>
    </div>
  );
}
