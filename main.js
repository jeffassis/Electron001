const { app, BrowserWindow, Menu } = require('electron')

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

// TEMPLATE MENU
const templateMenu = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo'
            },
            {
                label: 'Abirir'
            },
            {
                label: 'Salvar'
            },
            {
                label: 'Salvar como'
            },
            {
                label: 'Fechar',
                role: process.platform === 'darwin' ? 'quit' : 'close'
            }
        ]
    }
]

// MENU
const menu = Menu.buildFromTemplate(templateMenu)
Menu.setApplicationMenu(menu)

// ON READY 
app.whenReady().then(createWindow)

// ACTIVATE
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === o) {
        createWindow()
    }
})
