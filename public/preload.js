const { contextBridge } = require('electron');
const apimngr = require('./database/apimngr');  

// Expose API to renderer process
try { contextBridge.exposeInMainWorld('sqlite', {
  apimngr,
  })
}
catch (error) {
  console.error('Failed to expose API to renderer process:', error);
}

