const { app, BrowserWindow } = require('electron')

//JANELA PRINCIPAL
var mainWindow = null
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
}

// ON READY 
app.whenReady().then(createWindow)

