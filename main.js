const { app, BrowserWindow } = require('electron')

//JANELA PRINCIPAL
var mainWindow = null
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    // CHAMADA DO HTML
    await mainWindow.loadFile('src/pages/editor/index.html')
}

// ON READY 
app.whenReady().then(createWindow)

// ACTIVATE
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === o) {
        createWindow()
    }
})
