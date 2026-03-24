const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

app.disableHardwareAcceleration();

// ── Persistence ──
const DATA_FILE = path.join(app.getPath('userData'), 'xp-data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading XP data:', e);
  }
  return {
    level: 1,
    currentXP: 0,
    totalCommits: 0,
    shape: 'circular',
    position: 'bottom-right'
  };
}

function saveData(data) {
  try {
    const current = loadData();
    const merged = { ...current, ...data };
    fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2));
  } catch (e) {
    console.error('Error saving XP data:', e);
  }
}

// ── XP Config ──
const BASE_XP = 100;
const XP_PER_COMMIT = 25;
const GROWTH_FACTOR = 1.5;

function getMaxXP(level) {
  return Math.floor(BASE_XP * Math.pow(GROWTH_FACTOR, level - 1));
}

// ── Window & Layout ──
let win = null;
let tray = null;
let currentData = loadData();

function getLayout(shape, position) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const margin = 30;

  let winWidth, winHeight, x, y;

  if (shape === 'circular') {
    winWidth = 100;
    winHeight = 100;

    if (position === 'top-left') {
      x = margin;
      y = margin;
    } else if (position === 'top-right') {
      x = width - winWidth - margin;
      y = margin;
    } else if (position === 'bottom-left') {
      x = margin;
      y = height - winHeight - margin;
    } else { // bottom-right
      x = width - winWidth - margin;
      y = height - winHeight - margin;
    }
  } else { // horizontal
    winWidth = 400;
    winHeight = 40;
    x = Math.floor((width - winWidth) / 2);

    if (position === 'top') {
      y = margin;
    } else { // bottom
      y = height - winHeight - margin;
    }
  }

  return { x: Math.floor(x), y: Math.floor(y), width: winWidth, height: winHeight };
}

function updateAppLayout(shape, position) {
  currentData.shape = shape;
  currentData.position = position;
  saveData({ shape, position });

  const layout = getLayout(shape, position);
  if (win) {
    win.setBounds(layout);
    win.webContents.send('update-style', { shape, position });
  }
}

function buildTrayMenu() {
  const shape = currentData.shape || 'circular';
  const pos = currentData.position || 'bottom-right';

  const template = [
    { label: 'Git XP Bar v1.1', enabled: false },
    { type: 'separator' },
    {
      label: 'Cambiar Estilo',
      submenu: [
        {
          label: 'Forma',
          submenu: [
            { label: 'Circular', type: 'radio', checked: shape === 'circular', click: () => updateAppLayout('circular', 'bottom-right') },
            { label: 'Horizontal', type: 'radio', checked: shape === 'horizontal', click: () => updateAppLayout('horizontal', 'bottom') }
          ]
        },
        { type: 'separator' },
        {
          label: 'Posición',
          submenu: shape === 'circular' ? [
            { label: 'Arriba Izquierda', type: 'radio', checked: pos === 'top-left', click: () => updateAppLayout('circular', 'top-left') },
            { label: 'Arriba Derecha', type: 'radio', checked: pos === 'top-right', click: () => updateAppLayout('circular', 'top-right') },
            { label: 'Abajo Izquierda', type: 'radio', checked: pos === 'bottom-left', click: () => updateAppLayout('circular', 'bottom-left') },
            { label: 'Abajo Derecha', type: 'radio', checked: pos === 'bottom-right', click: () => updateAppLayout('circular', 'bottom-right') }
          ] : [
            { label: 'Arriba', type: 'radio', checked: pos === 'top', click: () => updateAppLayout('horizontal', 'top') },
            { label: 'Abajo', type: 'radio', checked: pos === 'bottom', click: () => updateAppLayout('horizontal', 'bottom') }
          ]
        }
      ]
    },
    { type: 'separator' },
    { label: 'Mostrar aplicación', click: () => win.show() },
    { label: 'Ocultar aplicación', click: () => win.hide() },
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() }
  ];

  return Menu.buildFromTemplate(template);
}

function createWindow() {
  currentData = loadData();
  const layout = getLayout(currentData.shape, currentData.position);

  // Create Tray Icon
  const iconDevPath = path.join(__dirname, 'icon.png');
  const iconPkgPath = path.join(process.resourcesPath, 'icon.png');
  let trayIcon = fs.existsSync(iconDevPath) ? nativeImage.createFromPath(iconDevPath) :
    (fs.existsSync(iconPkgPath) ? nativeImage.createFromPath(iconPkgPath) : nativeImage.createEmpty());

  tray = new Tray(trayIcon.isEmpty() ? nativeImage.createFromBuffer(Buffer.alloc(256)) : trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip('Git XP Bar');

  // Update menu whenever it might change
  const refreshMenu = () => tray.setContextMenu(buildTrayMenu());
  refreshMenu();
  ipcMain.on('refresh-menu', refreshMenu);

  win = new BrowserWindow({
    width: layout.width,
    height: layout.height,
    x: layout.x,
    y: layout.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    resizable: false,
    hasShadow: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setAlwaysOnTop(true, 'screen-saver', 1);
  win.loadFile('index.html');
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('init-data', currentData);
    win.webContents.send('update-style', { shape: currentData.shape, position: currentData.position });
  });

  // Polling for hover detection (adapted for dynamic bounds)
  let isHovered = false;
  setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const cursor = screen.getCursorScreenPoint();
    const bounds = win.getBounds();
    const inside =
      cursor.x >= bounds.x &&
      cursor.x <= bounds.x + bounds.width &&
      cursor.y >= bounds.y &&
      cursor.y <= bounds.y + bounds.height;

    if (inside && !isHovered) {
      isHovered = true;
      win.setIgnoreMouseEvents(false);
      win.webContents.send('hover-state', true);
    } else if (!inside && isHovered) {
      isHovered = false;
      win.setIgnoreMouseEvents(true, { forward: true });
      win.webContents.send('hover-state', false);
    }
  }, 50);
}

// ── IPC ──
ipcMain.on('save-data', (event, data) => saveData(data));

// ── Local HTTP Server ──
const PORT = 31415;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'POST' && req.url === '/commit') {
    if (win && !win.isDestroyed()) win.webContents.send('git-commit');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } else if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ running: true, ...loadData() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1');
server.on('error', (err) => { if (err.code === 'EADDRINUSE') app.quit(); });

// ── App Lifecycle ──
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) win.show(); });
  app.on('ready', () => setTimeout(createWindow, 400));
  app.on('window-all-closed', () => {
    server.close();
    if (process.platform !== 'darwin') app.quit();
  });
}