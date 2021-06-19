const { Console } = require('console')
const { FILE } = require('dns')
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

// SUBMENU CRIAR NOVO ARQUIVO
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

// SUBMENU SALVAR COMO 
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

// SUBMENU SALVAR ARQUIVO
function saveFile() {
    // VALOR VERDADEIRO -> SOBRESCREVE O CONTEUDO
    if (file.saved) {
        return writeFile(file.path)
    }
    // VALOR FALSO -> CHAMA O SALVAR COMO 
    return saveFileAs()
}

// LER ARQUIVO
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8')
    } catch (e) {
        console.log(e)
        return ''
    }
}

// SUBMENU ABRIR ARQUIVO
async function openFile() {
    // DIALOGO
    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path
    })
    // VERIFICAR CANCELAMENTO
    if (dialogFile.canceled) return false

    // ABRIR O ARQUIVO
    file = {
        name: path.basename(dialogFile.filePaths[0]),
        content: readFile(dialogFile.filePaths[0]),
        saved: true,
        path: dialogFile.filePaths[0]
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
                accelerator: 'CmdOrCtrl+N',
                click() {
                    createNewFile()
                }
            },
            {
                label: 'Abirir',
                accelerator: 'CmdOrCtrl+O',
                click() {
                    openFile()
                }
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    saveFile()
                }
            },
            {
                label: 'Salvar como',
                accelerator: 'CmdOrCtrl+Shift+S',
                click() {
                    saveFileAs()
                }
            },
            {
                label: 'Fechar',
                role: process.platform === 'darwin' ? 'quit' : 'close'
            }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            {
                label: 'Desfazer',
                role: 'undo'
            },
            {
                label: 'Refazer',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Copiar',
                role: 'copy'
            },
            {
                label: 'Colar',
                role: 'paste'
            },
            {
                label: 'Recortar',
                role: 'cut'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Entre em Contanto com: Jeff Assis!!!'
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
