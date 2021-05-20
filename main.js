// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'public' });
const ipc = require('electron').ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
    return !app.isPackaged;
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        minHeight: 650,
        minWidth: 450,
        width: 800,
        height: 700,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
        // Use this in development mode.
        icon: isDev() ? path.join(process.cwd(), 'public/favicon.png') : path.join(__dirname, 'public/favicon.png'),
        // Use this in production mode.
        // icon: path.join(__dirname, 'public/favicon.png'),
        show: false,
    });
    mainWindow.setMenuBarVisibility(false);


    if (isDev()) {
        mainWindow.loadURL('http://localhost:5000/');
    } else {
        loadURL(mainWindow);
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.webContents.send('app-close');
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
}
app.allowRendererProcessReuse = false;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

    app.quit();
});

ipc.on('closed', _ => {
    app.quit();
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
