import os from "os";
import fs from "fs";
import { content, parser } from "./scraper";
import { app, BrowserWindow, ipcMain } from "electron";
import { decrypt, encrypt, getHash } from "./crypto";
import { join, resolve } from "path";
import { Readable } from "stream";
import { download } from "./download";
import { extention } from "extensions/tumangaonline";

const { home, library, read, details, opts } = extention(content, parser);

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

ipcMain.on("download", async (e, { rid, root }) => {
  const { id, imgs } = await read(rid);
  const main =
    resolve(app.getPath("desktop")) + "/.dreader" + `/${await getHash(root)}`;
  const base = main + `/${rid}`;

  if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
  if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

  for (const img of imgs) {
    try {
      console.log("downloading...", img.page);
      const data = await download(img.url, opts?.headers);
      const stream = Readable.from(data);
      await encrypt(
        "some random password",
        resolve(base, `./${id}_${img.page}`),
        stream
      );
      console.log("done");
    } catch (error: any) {
      console.log("failed...", img.page);
      console.log("retrying..." + img.page);
      const data = await download(img.url, opts?.headers);
      const stream = Readable.from(data);
      await encrypt(
        "some random password",
        resolve(base, `./${id}_${img.page}`),
        stream
      );
      console.log("done");
    }
  }
  e.reply("download:done", rid);
});

ipcMain.on("get:home", async (e) => {
  const res = await home();

  e.reply("res:home", res);
});

ipcMain.on("get:details", async (e, { route }) => {
  const res = await details(route);
  e.reply("res:details", res);
});

ipcMain.on("get:library", async (e, { page, filters }) => {
  const res = await library(page, filters);
  e.reply("res:library", res.items);
});

ipcMain.on("get:read:init", async (e, { id }) => {
  const res = await read(id);
  console.log(res.info);

  e.reply("res:read:init", res);
});

ipcMain.on("get:read:page", async (e, { img }) => {
  if (!img.free) {
    try {
      console.log("reading");
      const res = await download(img.url, opts?.headers);
      e.reply("res:read:page", res);
    } catch (error: any) {
      console.log("failing");
      console.log("reading");
      const res = await download(img.url, opts?.headers);
      e.reply("res:read:page", res);
    }
  } else {
    e.reply("res:read:page", img.url);
  }
});

ipcMain.on("get:read:local", async (e, a) => {
  const main =
    app.getPath("desktop") + "/.dreader" + `/${await getHash(a.root)}`;

  if (!fs.existsSync(resolve(main))) {
    e.reply("res:read:local", false);
    return;
  }
  const base = main + `/${a.rid}`;

  if (!fs.existsSync(resolve(base))) {
    e.reply("res:read:local", false);
    return;
  }
  if (a.page > a.total) {
    e.reply("res:read:local", false);
    return;
  }
  const file = base + `/${a.id}_${a.page}`;
  try {
    const res = await decrypt("some random password", file);
    e.reply("res:read:local", res);
  } catch (error: any) {
    e.reply("res:read:local", false);
  }
});
