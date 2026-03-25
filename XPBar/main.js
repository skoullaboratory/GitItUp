const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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
    position: 'bottom-right',
    theme: 'cyan-green',
    opacity: 1.0
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

// ── Git Automation ──
function installGlobalHook() {
  const hooksDir = path.join(app.getPath('userData'), 'hooks');
  
  try {
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Configuración de los 3 hooks
    const hooks = [
      { name: 'post-commit', type: 'commit' },
      { name: 'pre-push', type: 'push' },
      { name: 'post-merge', type: 'pr' }
    ];

    hooks.forEach(h => {
      // Usamos & para que curl corra en segundo plano y no bloquee a Git
      const content = `#!/bin/sh\n# GitItUp Auto-Hook\ncurl -s -X POST http://127.0.0.1:31415/${h.type} > /dev/null 2>&1 &\nexit 0\n`;
      fs.writeFileSync(path.join(hooksDir, h.name), content, { mode: 0o755 });
    });

    exec('git --version', (err) => {
      if (err) return;
      exec('git config --global core.hooksPath', (err, stdout) => {
        const currentPath = stdout ? stdout.trim() : '';
        const gitPath = hooksDir.replace(/\\/g, '/');
        if (!currentPath || currentPath.toLowerCase() === gitPath.toLowerCase()) {
          exec(`git config --global core.hooksPath "${gitPath}"`);
        }
      });
    });
  } catch (e) {
    console.error('Exception during hook installation:', e);
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
    winWidth = 160;   // Increased from 140
    winHeight = 160;  // Increased from 140

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
    winWidth = 480;   // Increased from 460
    winHeight = 100;  // Increased from 80
    x = Math.floor((width - winWidth) / 2);

    if (position === 'top') {
      y = margin;
    } else { // bottom
      y = height - winHeight - margin;
    }
  }

  return { x: Math.floor(x), y: Math.floor(y), width: winWidth, height: winHeight };
}

function updateAppLayout(shape, position, theme) {
  if (shape) currentData.shape = shape;
  if (theme) currentData.theme = theme;
  
  // Validate position based on shape if shape changed or position provided
  if (shape) {
    if (shape === 'circular') {
      if (!['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(currentData.position)) {
        currentData.position = 'bottom-right';
      }
    } else {
      if (!['top', 'bottom'].includes(currentData.position)) {
        currentData.position = 'bottom';
      }
    }
  }
  
  if (position) currentData.position = position;

  saveData({ 
    shape: currentData.shape, 
    position: currentData.position, 
    theme: currentData.theme 
  });

  const layout = getLayout(currentData.shape, currentData.position);
  if (win) {
    win.setBounds(layout);
    win.webContents.send('update-style', { 
      shape: currentData.shape, 
      position: currentData.position, 
      theme: currentData.theme 
    });
    // Ensure window is always on top after move
    win.setAlwaysOnTop(true, 'screen-saver', 1);
  }
  if (tray) {
    tray.setContextMenu(buildTrayMenu());
  }
}

function expandWindow(expanded) {
  if (!win) return;
  const layout = getLayout(currentData.shape, currentData.position);
  if (expanded) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { x: areaX, y: areaY, width: areaW, height: areaH } = primaryDisplay.workArea;
    
    // Increased canvas size significantly to avoid scrollbars or cutoffs
    let expWidth = currentData.shape === 'circular' ? 550 : 700;
    let expHeight = currentData.shape === 'circular' ? 700 : 600;

    // Center the expanded window on the bar's current location
    let centerX = layout.x + layout.width / 2;
    let centerY = layout.y + layout.height / 2;

    let targetX = Math.floor(centerX - expWidth / 2);
    let targetY = Math.floor(centerY - expHeight / 2);

    // Padding from screen/workarea edges (20px)
    const p = 20;
    
    // Clamp to workArea (skipping taskbar)
    if (targetX < areaX + p) targetX = areaX + p;
    if (targetY < areaY + p) targetY = areaY + p;
    if (targetX + expWidth > areaX + areaW - p) targetX = areaX + areaW - expWidth - p;
    if (targetY + expHeight > areaY + areaH - p) targetY = areaY + areaH - expHeight - p;

    win.setBounds({
      x: targetX,
      y: targetY,
      width: expWidth,
      height: expHeight
    });
  } else {
    win.setBounds(layout);
  }
}

function buildTrayMenu() {
  const template = [
    { label: 'Salir de GitItUp', click: () => app.quit() }
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
  tray.setToolTip('GitItUp');

  // Update menu whenever it might change
  const refreshMenu = () => tray.setContextMenu(buildTrayMenu());
  refreshMenu();
  ipcMain.on('refresh-menu', refreshMenu);

  ipcMain.on('update-theme', (event, theme) => {
    updateAppLayout(null, null, theme);
  });

  ipcMain.on('update-shape', (event, shape) => {
    updateAppLayout(shape, null, null);
  });

  ipcMain.on('update-position', (event, position) => {
    updateAppLayout(null, position, null);
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  ipcMain.on('expand-window', (event, expanded) => {
    expandWindow(expanded);
  });

  ipcMain.on('update-opacity', (event, opacity) => {
    currentData.opacity = opacity;
    saveData({ opacity });
  });

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
    win.webContents.send('update-style', { 
      shape: currentData.shape, 
      position: currentData.position, 
      theme: currentData.theme 
    });
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
  
  // Extraer endpoint (commit, push, pr)
  const endpoint = req.url.split('?')[0].slice(1);
  const validEvents = ['commit', 'push', 'pr'];

  if (req.method === 'POST' && validEvents.includes(endpoint)) {
    console.log(`[Git Event] Recibido: ${endpoint}`);
    if (win && !win.isDestroyed()) win.webContents.send('git-event', endpoint);
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
  app.on('ready', () => {
    installGlobalHook();
    setTimeout(createWindow, 400);
  });
  app.on('window-all-closed', () => {
    server.close();
    if (process.platform !== 'darwin') app.quit();
  });
}