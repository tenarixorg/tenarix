import fs from "fs";
import base from "./extension";
import { ipcMain, BrowserWindow, app, nativeTheme } from "electron";
import { decrypt, encrypt, getHash } from "../crypto";
import { download } from "../download";
import { Readable } from "stream";
import { resolve } from "path";
import { getImg } from "../scraper";
import { theme } from "utils";

export const handler = (win?: BrowserWindow) => {
  let currentSourceName = "inmanga";
  let currentSource = base[currentSourceName];
  let currentTheme: "dark" | "light" = nativeTheme.shouldUseDarkColors
    ? "dark"
    : "light";

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

  ipcMain.on("get:theme", (e) => {
    e.reply("change:theme", theme[currentTheme]);
  });

  ipcMain.on("toggle:theme", (e) => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    e.reply("change:theme", theme[currentTheme]);
    e.reply("res:toggle:theme", currentTheme);
  });

  ipcMain.on("download", async (e, { rid, root }) => {
    const { id, imgs } = await currentSource.read(rid);
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    const main =
      resolve(app.getPath("desktop")) + "/.dreader" + `/${await getHash(root)}`;
    const base = main + `/${_rid}`;
    if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
    if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    for (const img of imgs) {
      try {
        console.log("downloading...", img.page);
        let data: Buffer | null = null;
        if (img.free) {
          data = await getImg(img.url);
        } else {
          data = await download(img.url, currentSource.opts?.headers);
        }
        if (data) {
          const stream = Readable.from(data);
          await encrypt(
            "some random password",
            resolve(base, `./${id}_${img.page}`),
            stream
          );
        }
        console.log("done");
      } catch (error: any) {
        console.log("failed...", img.page);
        console.log("retrying..." + img.page);
        let data: Buffer | null = null;
        if (img.free) {
          data = await getImg(img.url);
        } else {
          data = await download(img.url, currentSource.opts?.headers);
        }
        if (data) {
          const stream = Readable.from(data);
          await encrypt(
            "some random password",
            resolve(base, `./${id}_${img.page}`),
            stream
          );
        }
        console.log("done");
      }
    }
    e.reply("download:done", rid);
  });

  ipcMain.on("get:settings", (e) => {
    const res = Object.keys(base);
    e.reply("res:settings", { current: currentSourceName, data: res });
  });

  ipcMain.on("change:source", (e, { source }) => {
    const c = currentSourceName;
    currentSource = base[source];
    currentSourceName = source;
    e.reply("res:change:source", { c, n: source });
  });

  ipcMain.on("get:home", async (e) => {
    const res = await currentSource.home();
    e.reply("res:home", res);
  });

  ipcMain.on("get:details", async (e, { route }) => {
    const res = await currentSource.details(route);
    e.reply("res:details", res);
  });

  ipcMain.on("get:library", async (e, { page, filters }) => {
    const res = await currentSource.library(page, filters);
    e.reply("res:library", res.items);
  });

  ipcMain.on("get:read:init", async (e, { id }) => {
    const res = await currentSource.read(id);
    e.reply("res:read:init", res);
  });

  ipcMain.on("get:read:page", async (e, { img }) => {
    if (!img.free) {
      try {
        console.log("reading");
        const res = await download(img.url, currentSource.opts?.headers);
        e.reply("res:read:page", res);
      } catch (error: any) {
        console.log("failing");
        console.log("reading");
        const res = await download(img.url, currentSource.opts?.headers);
        e.reply("res:read:page", res);
      }
    } else {
      e.reply("res:read:page", img.url);
    }
  });

  ipcMain.on("get:read:local", async (e, a) => {
    const _rid = (a.rid as string).includes("=") ? await getHash(a.rid) : a.rid;
    const main =
      app.getPath("desktop") + "/.dreader" + `/${await getHash(a.root)}`;
    if (!fs.existsSync(resolve(main))) {
      e.reply("res:read:local", false);
      return;
    }
    const base = main + `/${_rid}`;
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
};
