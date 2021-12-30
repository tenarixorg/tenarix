import os from "os";
import { app, BrowserWindow, ipcMain } from "electron";
import { join, resolve } from "path";
import { decrypt, encrypt, getHash } from "./crypto";
import { download } from "./download";
import fs from "fs";

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
    title: "TMO Reader",
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

ipcMain.on("closeApp", () => {
  win?.close();
});
ipcMain.on("minimizeApp", () => {
  win?.minimize();
});
ipcMain.on("maximizeApp", () => {
  if (win?.isMaximized()) {
    win.restore();
  } else {
    win?.maximize();
  }
});

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

ipcMain.on("download", async (e, { rid, id, total, root }) => {
  const main =
    resolve(app.getPath("desktop")) + "/.dreader" + `/${getHash(root)}`;
  const base = main + `/${rid}`;

  if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
  if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

  for (let i = 0; i < total; i++) {
    const stream = await download(
      `http://localhost:4000/api/v1/page/${id}/${i + 1}`
    );
    await encrypt(
      "some random password",
      resolve(base, `./${id}_${i + 1}`),
      stream
    );
  }
  e.reply("download:done", rid);
});

ipcMain.on("read:page", async (e, a) => {
  const main =
    resolve(app.getPath("desktop")) + "/.dreader" + `/${getHash(a.root)}`;
  if (!fs.existsSync(main)) {
    e.reply("read:done", false);
    return;
  }
  const base = main + `/${a.rid}`;
  if (!fs.existsSync(base)) {
    e.reply("read:done", false);
    return;
  }
  if (a.page > a.total) {
    e.reply("read:done", false);
    return;
  }
  const file = base + `/${a.id}_${a.page}`;
  try {
    const res = await decrypt("some random password", file);
    e.reply("read:done", res);
  } catch (error: any) {
    e.reply("read:done", false);
  }
});
