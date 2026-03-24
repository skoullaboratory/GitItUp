const { app, BrowserWindow, screen, ipcMain } = require('electron');
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
  return { level: 1, currentXP: 0, totalCommits: 0 };
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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

// ── Window ──
let win = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const winWidth = 100;
  const winHeight = 100;
  const winX = Math.floor(width - winWidth - 30);
  const winY = Math.floor(height - winHeight - 30);

  win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: winX,
    y: winY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setAlwaysOnTop(true, 'screen-saver', 1);
  win.loadFile('index.html');
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Send saved data to renderer once loaded
  win.webContents.on('did-finish-load', () => {
    const data = loadData();
    win.webContents.send('init-data', data);
  });

  // Polling for hover detection
  let isHovered = false;
  setInterval(() => {
    const cursor = screen.getCursorScreenPoint();
    const inside =
      cursor.x >= winX &&
      cursor.x <= winX + winWidth &&
      cursor.y >= winY &&
      cursor.y <= winY + winHeight;

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

// ── Save data from renderer ──
ipcMain.on('save-data', (event, data) => {
  saveData(data);
});

// ── Local HTTP Server for Git Hook ──
const PORT = 31415;

const server = http.createServer((req, res) => {
  // CORS headers for safety
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST' && req.url === '/commit') {
    // Git commit received — add XP
    if (win && !win.isDestroyed()) {
      win.webContents.send('git-commit');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, message: 'XP added!' }));
  } else if (req.method === 'GET' && req.url === '/status') {
    // Status endpoint to check if the app is running
    const data = loadData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ running: true, ...data }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`XP Bar listening on http://127.0.0.1:${PORT}`);
});

// ── App Lifecycle ──
app.on('ready', () => setTimeout(createWindow, 400));
app.on('window-all-closed', () => {
  server.close();
  if (process.platform !== 'darwin') app.quit();
});