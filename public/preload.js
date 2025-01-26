const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  createCollection: (name) => ipcRenderer.invoke('db-create-collection', name),
  getCollections: () => ipcRenderer.invoke('db-get-collections'),
  getRequestsInCollection: (collectionId) => ipcRenderer.invoke('db-get-requests-in-collection', collectionId),
  addRequestToCollection: (data) => ipcRenderer.invoke('db-add-request-to-collection', data),
  deleteCollection: (collectionId) => ipcRenderer.invoke('db-delete-collection', collectionId),
  groupRequestsByTime: () => ipcRenderer.invoke('db-group-requests-by-time'),
  validateCollectionName: (name) => ipcRenderer.invoke('db-validate-collection-name', name),
  getCollectionName: (id) => ipcRenderer.invoke('db-get-collection-name', id),
  onCleanup: (callback) => ipcRenderer.on('cleanup-db', callback),
});
