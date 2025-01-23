declare global {
  interface Window {
    sqlite: {
      apimngr: {
        groupRequestsByTime: () => any;
        addRequestToCollection: (id: number, name: string, url: string, method: string, timestamp: string) => void;
        getRequestsInCollection: (id: number) => any[];
        validateCollectionName: (name: string) => number;
        deleteCollection: (id: number) => void;
        getCollections: () => Array<{ id: number; name: string; }>;
        createCollection: (name: string) => number;
      } 
    };
  }
}

export {}; 