import os from "os";
import { app, BrowserWindow } from "electron";
import { join } from "path";
import { handler } from "./core";

const isWin7 = os.release().startsWith("6.1");
if (isWin7) app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

async function mainWin() {
  win = new BrowserWindow({
    titleBarStyle: "hidden",
    title: "X Reader",
    minWidth: 850,
    minHeight: 500,
    width: 850,
    height: 500,
    show: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
      nodeIntegration: true,
    },
  });

  handler(win);

  win?.on("resize", () => {
    if (win?.isNormal()) {
      win.webContents.send("resize", false);
    } else {
      win?.webContents.send("resize", true);
    }
  });

  win?.on("ready-to-show", () => {
    win?.show();
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    win.loadURL("http://localhost:3344");
  }
}

app.whenReady().then(mainWin);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
