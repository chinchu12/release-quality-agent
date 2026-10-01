const { app, BrowserWindow, screen } = require("electron");

let win;
let direction = -1;
let x;
let y;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  win = new BrowserWindow({
    width: 360,
    height: 460,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile("index.html");

  x = width - 390;
  y = height - 500;

  win.setPosition(x, y);

  setInterval(() => {
    if (!win) return;

    x += direction * 2;

    if (x <= 20) {
      direction = 1;
    }

    if (x >= width - 380) {
      direction = -1;
    }

    win.setPosition(Math.round(x), y);
  }, 30);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});