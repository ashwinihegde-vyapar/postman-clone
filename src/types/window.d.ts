declare global {
  interface Window {
    getApi: () => string;
    sqlite: {
      apimngr: {
        getApi: () => string;
        addRequestToCollection: (collectionId: number, name: string, url: string, method: string, timestamp: string) => void;
        getRequestsInCollection: (collectionId: number) => any[];
        getCollectionName: (collectionId: number) => string;
        getCollections: () => any[];
        createCollection: (name: string) => number;
      }
    }
  }
}

export {}; 