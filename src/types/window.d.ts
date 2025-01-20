declare global {
  interface Window {
    getApi: () => string;
    sqlite: {
      apimngr: {
        getApi: () => string;
      }
    }
  }
}

export {}; 