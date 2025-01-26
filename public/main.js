const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { createCollection, addRequestToCollection, getCollections, getCollectionName, getRequestsInCollection, groupRequestsByTime, validateCollectionName, deleteCollection } = require('./database/dbmanager');

function createWindow () {
  const win = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      // sandbox: false
    }
  });

  const appURL = app.isPackaged
		? url.format({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file:",
				slashes: true,
		  })
		: "http://localhost:3000"
	win.loadURL(appURL)
}

console.log('Preload path:', path.join(__dirname, 'preload.js'));

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // Send cleanup signal to renderer process
  if (BrowserWindow.getAllWindows()[0]) {
    BrowserWindow.getAllWindows()[0].webContents.send('cleanup-db');
  }
});

ipcMain.handle('db-create-collection', async (_, name) => createCollection(name));

ipcMain.handle('db-get-collections', async () => getCollections());
ipcMain.handle('db-get-requests-in-collection', async (_, collectionId) => getRequestsInCollection(collectionId));
ipcMain.handle('db-add-request-to-collection', async (_, { collectionId, name, url, method, timestamp }) =>
  addRequestToCollection(collectionId, name, url, method, timestamp)
);
ipcMain.handle('db-delete-collection', async (_, collectionId) =>
  deleteCollection(collectionId)
);
ipcMain.handle('db-validate-collection-name', async (_, name) => validateCollectionName(name)); 
ipcMain.handle('db-get-collection-name', async (_, id) => getCollectionName(id));
ipcMain.handle('db-group-requests-by-time', async () => groupRequestsByTime());
