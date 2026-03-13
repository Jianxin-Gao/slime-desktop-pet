const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // 隐藏菜单栏
  Menu.setApplicationMenu(null);

  // 打开开发者工具（可选，调试时使用）
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  // 监听窗口移动事件
  ipcMain.on('drag-window', (event, movementX, movementY) => {
    const [currentX, currentY] = mainWindow.getPosition();
    const newX = currentX + movementX;
    const newY = currentY + movementY;
    mainWindow.setPosition(newX, newY, false);
  });

  // 监听右键菜单事件
  ipcMain.on('show-context-menu', (event) => {
    const contextMenu = new Menu();
    
    contextMenu.append(new MenuItem({
      label: '喂食',
      click: () => {
        event.sender.send('menu-action', 'feed');
      }
    }));
    
    contextMenu.append(new MenuItem({
      label: '摸摸',
      click: () => {
        event.sender.send('menu-action', 'pet');
      }
    }));
    
    contextMenu.append(new MenuItem({
      type: 'separator'
    }));
    
    contextMenu.append(new MenuItem({
      label: '退出桌宠',
      click: () => {
        app.quit();
      }
    }));
    
    contextMenu.popup({ window: mainWindow });
  });
}

// 定义 MenuItem
const MenuItem = require('electron').MenuItem;

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
