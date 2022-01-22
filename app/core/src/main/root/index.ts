import fs from "fs";
import lang from "./language";
import baseExt from "./extension";
import { ipcMain, BrowserWindow, app, nativeTheme, session } from "electron";
import { matchSystemLang, theme, getAllExt } from "utils";
import { decryptChapter, downloadEncrypt } from "./helper";
import { resolve } from "path";
import { getHash } from "workers";
import {
  getCache,
  setCache,
  hasCache,
  hasFavorite,
  setFavorite,
  removeFavorite,
  getFavorite,
  getAllFavs,
  hasPinExt,
  setPinExt,
  removePinExt,
  setDownload,
  hasDownload,
  getDownload,
  getAllExtDownloads,
  getSettings,
  setSettings,
} from "../store";

export const handler = (win?: BrowserWindow) => {
  let currentSourceName = "inmanga";
  const slang = matchSystemLang(Object.keys(lang), app.getLocale(), "en-EN");
  let currentLangId = slang || "en-EN";
  let currentSource = baseExt[currentSourceName];
  let currentLang = lang[currentLangId];
  let currentTheme: "dark" | "light" = nativeTheme.shouldUseDarkColors
    ? "dark"
    : "light";

  const filter = {
    urls: ["*://*/*"],
  };

  const maxDowns = 2;
  let currentDowns = 0;

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (det, cb) => {
    const url = new URL(det.url);
    det.requestHeaders["Origin"] = url.origin;
    if (currentSource.opts) {
      for (const key of Object.keys(currentSource.opts.headers)) {
        if (
          key.toLowerCase() === "referer" &&
          !!currentSource.opts.refererRule
        ) {
          det.requestHeaders[key] = currentSource.opts.refererRule(url.href);
        } else {
          det.requestHeaders[key] = currentSource.opts.headers[key];
        }
      }
    }
    cb({ cancel: false, requestHeaders: det.requestHeaders });
  });

  /** App windowing */

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

  /** App theme */

  ipcMain.on("get:theme", (e) => {
    e.reply("change:theme", theme[getSettings()?.theme || currentTheme]);
  });

  ipcMain.on("toggle:theme", (e) => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    setSettings({
      lang: getSettings()?.lang || currentLangId,
      theme: currentTheme,
    });
    e.reply("change:theme", theme[currentTheme]);
    e.reply("res:toggle:theme", currentTheme);
  });

  /** App language */

  ipcMain.on("get:lang", (e) => {
    e.reply("res:lang:id", getSettings()?.lang || currentLangId);
    e.reply(
      "res:lang",
      lang[getSettings()?.lang || currentLangId] || currentLang
    );
  });

  ipcMain.on("change:lang", (e, { id }) => {
    currentLangId = id;
    currentLang = lang[id];
    setSettings({
      lang: currentLangId,
      theme: getSettings()?.theme || currentTheme,
    });
    e.reply("res:lang", currentLang);
  });

  ipcMain.on("get:all:lang", (e) => {
    const keys = Object.keys(lang);
    const res = keys.map((curr) => ({ id: curr, name: lang[curr].name }));
    e.reply("res:all:lang", res);
  });

  /** App extension source */

  ipcMain.on("change:source", (e, { source }) => {
    const c = currentSourceName;
    currentSource = baseExt[source];
    currentSourceName = source;
    e.reply("res:change:source", { c, n: source });
  });

  /** App downloads */

  ipcMain.on(
    "download",
    async (e, { rid, root, id, imgs, title, info, pages, ext }) => {
      if (currentDowns < maxDowns) {
        currentDowns++;
        const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
        const main =
          resolve(app.getPath("desktop") + "/.tenarix") +
          "/.dreader" +
          `/${await getHash(root)}`;
        const base = main + `/${_rid}`;
        if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
        if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
        const source = ext || currentSourceName;

        setDownload(rid, source, {
          data: { title, info, pages, id, rid: rid },
          done: false,
          inProgress: true,
        });
        e.reply("res:downloaded", getAllExtDownloads(source));
        try {
          win?.webContents.send("downloading:chapter", {
            rid,
            inf: title + " | " + info,
          });
          await downloadEncrypt(
            base,
            `./${id}_`,
            imgs,
            currentSource.opts?.refererRule
              ? { Referer: currentSource.opts.refererRule(imgs[0].url) }
              : currentSource.opts?.headers
          );
          win?.webContents.send("downloading:chapter:done", {
            rid,
          });
          setDownload(rid, source, {
            data: { title, info, pages, id, rid: rid },
            done: true,
            inProgress: false,
          });
          currentDowns--;
          e.reply("download:done", rid);
          e.reply("res:downloaded", getAllExtDownloads(source));
        } catch (error: any) {
          currentDowns--;
          e.reply("download:done", rid);
          e.reply("res:error", { error: error.message });
        }
      } else {
        e.reply("download:done", rid);
        e.reply("res:error", { error: "Download limit reached" });
      }
    }
  );

  ipcMain.on("get:downloaded", (e, { ext }) => {
    const res = getAllExtDownloads(ext || currentSourceName);
    e.reply("res:downloaded", res);
  });

  /** App home */

  ipcMain.on("get:home", async (e) => {
    try {
      if (hasCache(currentSourceName, "home")) {
        e.reply("res:home", getCache(currentSourceName, "home"));
      } else {
        const res = await currentSource.home();
        setCache(currentSourceName, "home", res);
        e.reply("res:home", res);
      }
    } catch (error: any) {
      e.reply("res:error", { error: error.message });
    }
  });

  /** App details */

  ipcMain.on("get:details", async (e, { route, ext }) => {
    try {
      if (ext) {
        e.reply("res:details", {
          res: getFavorite(ext, route),
          fav: true,
        });
        return;
      }
      const key = "details" + route;
      if (hasFavorite(currentSourceName, route)) {
        e.reply("res:details", {
          res: getFavorite(currentSourceName, route),
          fav: true,
        });
      } else if (hasCache(currentSourceName, key)) {
        e.reply("res:details", {
          res: getCache(currentSourceName, key),
          fav: false,
        });
      } else {
        const res = await currentSource.details(route);
        setCache(currentSourceName, key, res);
        e.reply("res:details", { res, fav: false });
      }
    } catch (error: any) {
      e.reply("res:error", { msg: error.message });
    }
  });

  /** App library */

  ipcMain.on("get:library", async (e, { page, filters }) => {
    const key =
      "library" + page + JSON.stringify(filters).replace(/({|}|,|"|:)/g, "");
    try {
      if (hasCache(currentSourceName, key)) {
        e.reply("res:library", getCache(currentSourceName, key));
      } else {
        const res = await currentSource.library(page, filters);
        setCache(currentSourceName, key, res.items);
        e.reply("res:library", res.items);
      }
    } catch (error: any) {
      e.reply("res:error", { msg: error.message });
    }
  });

  /** App read */

  ipcMain.on("get:read:init", async (e, { id, ext }) => {
    const key = "read" + id;
    const source = ext || currentSourceName;
    currentSource = baseExt[source];
    try {
      if (hasDownload(id, source) && getDownload(id, source)?.done) {
        e.reply("res:read:init", getDownload(id, source)?.data);
      } else if (hasCache(source, key)) {
        e.reply("res:read:init", getCache(source, key));
      } else {
        const res = await currentSource.read(id);
        setCache(source, key, res);
        e.reply("res:read:init", res);
      }
    } catch (error: any) {
      e.reply("res:error", { msg: error.message });
    }
  });

  ipcMain.on("get:read:page", async (e, { img }) => {
    // Passthrough == delay
    e.reply("res:read:page", img);
  });

  ipcMain.on("get:read:local", async (e, { rid, root, id, total, ext }) => {
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    if (getDownload(rid, ext || currentSourceName)?.inProgress) {
      e.reply("res:read:local", false);
      return;
    }
    const main =
      app.getPath("desktop") +
      "/.tenarix" +
      "/.dreader" +
      `/${await getHash(root)}`;
    if (!fs.existsSync(resolve(main))) {
      e.reply("res:read:local", false);
      return;
    }
    const base = main + `/${_rid}`;
    if (!fs.existsSync(resolve(base))) {
      e.reply("res:read:local", false);
      return;
    }
    try {
      const res = await decryptChapter(base, `/${id}_`, total);
      e.reply("res:read:local", res);
    } catch (error: any) {
      e.reply("res:error", { error: error.message });
    }
  });

  /** App favorites */

  ipcMain.on("set:favorite", (_e, { route, data }) => {
    if (hasFavorite(currentSourceName, route)) return;
    setFavorite(currentSourceName, route, data);
  });

  ipcMain.on("remove:favorite", (_e, { route, ext }) => {
    const _ext = ext || currentSource;
    removeFavorite(_ext, route);
  });

  ipcMain.on("get:favorites", (e) => {
    const res = getAllFavs();
    e.reply("res:favorites", res);
  });

  /** App extensions - pinned extensions */

  ipcMain.on("get:exts", (e) => {
    const res = getAllExt(baseExt, hasPinExt);
    e.reply("res:exts", res);
  });

  ipcMain.on("add:pin:ext", (e, { ext }) => {
    setPinExt(ext);
    const res = getAllExt(baseExt, hasPinExt);
    e.reply("res:exts", res);
  });

  ipcMain.on("remove:pin:ext", (e, { ext }) => {
    removePinExt(ext);
    const res = getAllExt(baseExt, hasPinExt);
    e.reply("res:exts", res);
  });
};
