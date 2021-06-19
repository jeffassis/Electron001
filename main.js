const { app, BrowserWindow, Menu } = require('electron')

//JANELA PRINCIPAL
var mainWindow = null
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    // CHAMADA DO HTML
    await mainWindow.loadFile('src/pages/editor/index.html')

    // mainWindow.webContents.openDevTools()
    createNewFile()
}

// ARQUIVO
var file = {}

// CRIAR NOVO ARQUIVO
function createNewFile() {
    file = {
        name: 'novo-arquivo.txt',
        content: '',
        saved: false,
        path: app.getPath('documents') + '/novo-arquivo.txt'
    }

    mainWindow.webContents.send('set-file', file)
}

// TEMPLATE MENU
const templateMenu = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                click() {
                    createNewFile()
                }
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
