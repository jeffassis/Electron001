const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

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

    ipcMain.on('update-content', function (event, data) {
        file.content = data
    })
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

// SALVA ARQUIVO NO DISCO
function writeFile(filePath) {
    try {
        fs.writeFile(filePath, file.content, function (error) {
            // ERRO
            if (error) throw error
            // ARQUIVO SALVO
            file.path = filePath
            file.saved = true
            file.name = path.basename(filePath)

            mainWindow.webContents.send('set-file', file)
        })
    } catch (e) {
        console.log(e)
    }
}

// SALVAR COMO 
async function saveFileAs() {
    // DIALOG 
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    })
    // VERIFICAR CANCELAMENTO
    if (dialogFile.canceled) {
        return false
    }

    // SALVAR ARQUIVO
    writeFile(dialogFile.filePath)
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
                label: 'Salvar como',
                click() {
                    saveFileAs()
                }
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
