const { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// High-performance hardware acceleration configuration for macOS transparent overlays
app.commandLine.appendSwitch('disable-features', 'Dawn,SkiaGraphite');
app.commandLine.appendSwitch('enable-transparent-visuals');

let mainWindow = null;
let tray = null;
let isPlaying = true;
let isSoundEnabled = false; // Muted by default for screen overlays so it doesn't distract work
let isClickThrough = true;
let isClickToBlast = true; // Click anywhere to blast rocket
let intensityMode = 'festive'; // 'subtle' | 'festive' | 'celebration'
let clickMonitorProcess = null;

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    transparent: true,
    frame: false,
    hasShadow: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    enableLargerThanScreen: true,
    fullscreenable: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      backgroundThrottling: false, // Prevents throttling when clicking other apps!
    },
  });

  if (process.platform === 'darwin') {
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
  }

  // Click-through by default so user can work uninterrupted
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  mainWindow.loadFile(path.join(__dirname, 'overlay.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Track global cursor position across all macOS apps
  let lastX = -1;
  let lastY = -1;
  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        const cursor = screen.getCursorScreenPoint();
        if (cursor.x !== lastX || cursor.y !== lastY) {
          lastX = cursor.x;
          lastY = cursor.y;
          mainWindow.webContents.send('cursor-move', cursor);
        }
      } catch {}
    }
  }, 32);

  // Start global click monitor for "Click anywhere to blast rocket"
  startGlobalClickMonitor();

  // Handle display resolution or monitor changes
  screen.on('display-metrics-changed', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const display = screen.getPrimaryDisplay();
      mainWindow.setBounds(display.bounds);
    }
  });
}

function startGlobalClickMonitor() {
  const monitorBin = path.join(__dirname, 'click-monitor');
  if (!fs.existsSync(monitorBin)) {
    console.log('[ClickMonitor] Binary not found at', monitorBin);
    return;
  }

  try {
    clickMonitorProcess = spawn(monitorBin, [], { stdio: ['ignore', 'pipe', 'ignore'] });
    let buffer = '';

    clickMonitorProcess.stdout.on('data', (data) => {
      if (!isClickToBlast) return;
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep remainder

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const parts = trimmed.split(',');
        if (parts.length === 2) {
          const x = parseInt(parts[0], 10);
          const y = parseInt(parts[1], 10);
          if (!isNaN(x) && !isNaN(y) && mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-click', { x, y });
          }
        }
      }
    });

    clickMonitorProcess.on('error', (err) => {
      console.warn('[ClickMonitor] Process error:', err.message);
    });
  } catch (err) {
    console.warn('[ClickMonitor] Failed to start:', err.message);
  }
}

function createTrayIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <ellipse cx="16" cy="22" rx="12" ry="6" fill="#FF9800"/>
    <path d="M16 6 C12 12, 12 16, 16 19 C20 16, 20 12, 16 6 Z" fill="#FFD700"/>
    <circle cx="16" cy="15" r="2.5" fill="#FFFFFF"/>
  </svg>`;
  const icon = nativeImage.createFromBuffer(Buffer.from(svg), { scaleFactor: 2.0 }).resize({ width: 18, height: 18 });
  icon.setTemplateImage(false);

  tray = new Tray(icon);
  tray.setToolTip('🪔 Diwali Screen Overlay');
  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: '🪔 Diwali Desktop Overlay', enabled: false },
    { type: 'separator' },
    {
      label: isPlaying ? '⏸️ Pause Animations' : '▶️ Resume Animations',
      click: () => {
        isPlaying = !isPlaying;
        if (mainWindow) mainWindow.webContents.send('toggle-play', isPlaying);
        updateTrayMenu();
      },
    },
    {
      label: isClickToBlast ? '💥 Click-to-Blast Rocket: ON' : '💥 Click-to-Blast Rocket: OFF',
      click: () => {
        isClickToBlast = !isClickToBlast;
        updateTrayMenu();
      },
    },
    {
      label: isSoundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF (Muted)',
      click: () => {
        isSoundEnabled = !isSoundEnabled;
        if (mainWindow) mainWindow.webContents.send('toggle-sound', isSoundEnabled);
        updateTrayMenu();
      },
    },
    { type: 'separator' },
    {
      label: '🎚️ Master Intensity',
      submenu: [
        {
          label: '🌿 Subtle (Peaceful & Calm)',
          type: 'radio',
          checked: intensityMode === 'subtle',
          click: () => {
            intensityMode = 'subtle';
            if (mainWindow) mainWindow.webContents.send('change-intensity', 'subtle');
            updateTrayMenu();
          },
        },
        {
          label: '🪔 Festive (Balanced Default)',
          type: 'radio',
          checked: intensityMode === 'festive',
          click: () => {
            intensityMode = 'festive';
            if (mainWindow) mainWindow.webContents.send('change-intensity', 'festive');
            updateTrayMenu();
          },
        },
        {
          label: '🎆 Celebration (Grand Finale)',
          type: 'radio',
          checked: intensityMode === 'celebration',
          click: () => {
            intensityMode = 'celebration';
            if (mainWindow) mainWindow.webContents.send('change-intensity', 'celebration');
            updateTrayMenu();
          },
        },
      ],
    },
    {
      label: '🚀 Launch Salvo (5 Rockets)',
      click: () => {
        if (mainWindow) mainWindow.webContents.send('burst-salvo', 5);
      },
    },
    { type: 'separator' },
    {
      label: '❌ Quit Overlay',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  createOverlayWindow();
  createTrayIcon();
});

app.on('will-quit', () => {
  if (clickMonitorProcess) {
    try {
      clickMonitorProcess.kill();
    } catch {}
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
