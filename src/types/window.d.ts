declare global {
  interface Window {
    getApi: () => string;
    sqlite: {
      apimngr: {
        addRequestToCollection: (collectionId: number, name: string, url: string, method: string, timestamp: string) => void;
        getRequestsInCollection: (collectionId: number) => any[];
        getCollectionName: (collectionId: number) => string;
        getCollections: () => any[];
        createCollection: (name: string) => number;
        validateCollectionName: (name: string) => number;
        groupRequestsByTime: () => any[];
        deleteCollection: (collectionId: number) => void;
      }
    }
  }
}

export {}; 