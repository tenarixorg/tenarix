import os from "os";
import events from "./events";
import { app, BrowserWindow } from "electron";
import { AppHandler } from "./handler";
import { join } from "path";

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
    title: "Tenarix",
    minWidth: 950,
    minHeight: 520,
    width: 950,
    height: 520,
    show: false,
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  const handler = new AppHandler(win);

  handler.init(events);

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
