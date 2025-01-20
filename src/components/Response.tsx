import React, { useState, useEffect } from 'react';
import './styles.css';  

export default function Response({ response, loading }) {
  const [doc, setDoc] = useState('{}');

  useEffect(() => {
    if (response === null) return;
    const jsonResponse = JSON.stringify(response.data, null, 2);
    setDoc(jsonResponse);
  }, [response, loading]);

  const hasResponse = !(response == null);

  let status = '';


  if (hasResponse) {
    status = response.status;
  }

  const RenderedResponseMeta = () => (
    <div className="response-meta">
      <span>Status: {status}</span>
    </div>
  );

  return (
    <div className="response">
      <span className="response-title">Response</span>
      {hasResponse ? <RenderedResponseMeta /> : null}
      <pre>{doc}</pre>
    </div>
  );
}
