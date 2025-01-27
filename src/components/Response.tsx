import React, { useState, useEffect, cache } from 'react';
import '../assets/styles.css';  
import { getMostRecentResponse, storeAPIResponse, listAllResponses } from '../utils/indexedDb';

export default function Response({ response, loading, isOnline, error }) {
  const [doc, setDoc] = useState('{}');
  const [cachedResponse ,setCachedResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (isOnline && response?.data) {
        try {
          const jsonResponse = JSON.stringify(response.data, null, 2);
          setDoc(jsonResponse);
          // Store/update the response
          await storeAPIResponse(response.config.url, response.data);
        } catch (error) {
          console.error('Error handling response:', error);
        }
      } else if (!isOnline) {
        try {
          // First try to get response for specific URL if available
          // let cachedResponse = null;
          // if (response?.config?.url) {
          //   cachedResponse = await getResponseByUrl(response.config.url);
          // }
          
          // If no specific response found, get most recent
          // if (!cachedResponse) {
          const cachedResponse = await getMostRecentResponse();
          // }
          console.log(cachedResponse);
          if (cachedResponse) {
            setCachedResponse(cachedResponse);
            const responseData = JSON.stringify(cachedResponse.data, null, 2);
            setDoc(responseData);
            console.log('Using cached response from:', new Date(cachedResponse.timestamp));
          } else {
            setDoc('No cached response available');
            setCachedResponse('');
          }
        } catch (err) {
          console.error('Error fetching cached response:', err);
          setDoc('Error loading cached response');
          setCachedResponse('');
        }
      }
    };

    fetchData();
  }, [response, loading, isOnline]);

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
