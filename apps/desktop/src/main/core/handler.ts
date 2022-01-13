import fs from "fs";
import base from "./extension";
import lang from "./language";
import { ipcMain, BrowserWindow, app, nativeTheme, session } from "electron";
import { decryptChapter, downloadEncrypt } from "./helper";
import { resolve } from "path";
import { getHash } from "workers";
import { theme } from "utils";
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
} from "../store";

export const handler = (win?: BrowserWindow) => {
  let currentSourceName = "inmanga";
  let currentLangId = "en-EN";
  let currentSource = base[currentSourceName];
  let currentLang = lang[currentLangId];
  let currentTheme: "dark" | "light" = nativeTheme.shouldUseDarkColors
    ? "dark"
    : "light";

  const filter = {
    urls: ["*://*/*"],
  };

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

  ipcMain.on("get:lang", (e) => {
    e.reply("res:lang:id", currentLangId);
    e.reply("res:lang", currentLang);
  });

  ipcMain.on("change:lang", (e, { id }) => {
    currentLangId = id;
    currentLang = lang[id];
    e.reply("res:lang", currentLang);
  });

  ipcMain.on("get:all:lang", (e) => {
    const keys = Object.keys(lang);

    const names: string[] = [];

    for (const key of keys) {
      names.push(lang[key].name);
    }

    const res: { name: string; id: string }[] = [];

    for (let i = 0; i < keys.length; i++) {
      res.push({ id: keys[i], name: names[i] });
    }

    e.reply("res:all:lang", res);
  });

  ipcMain.on(
    "download",
    async (e, { rid, root, id, imgs, title, info, pages }) => {
      const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
      const main =
        resolve(app.getPath("desktop") + "/xreader") +
        "/.dreader" +
        `/${await getHash(root)}`;
      const base = main + `/${_rid}`;
      if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
      if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
      console.log("downloading");
      const res = await downloadEncrypt(
        base,
        `./${id}_`,
        imgs,
        currentSource.opts?.refererRule
          ? { Referer: currentSource.opts.refererRule(imgs[0].url) }
          : currentSource.opts?.headers
      );
      console.log(res);
      setDownload(rid, currentSourceName, { title, info, pages, id });
      e.reply("download:done", rid);
      e.reply("res:downloaded", getAllExtDownloads(currentSourceName));
    }
  );

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
    if (hasCache(currentSourceName, "home")) {
      e.reply("res:home", getCache(currentSourceName, "home"));
    } else {
      const res = await currentSource.home();
      setCache(currentSourceName, "home", res);
      e.reply("res:home", res);
    }
  });

  ipcMain.on("get:details", async (e, { route, ext }) => {
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
  });

  ipcMain.on("get:library", async (e, { page, filters }) => {
    const key =
      "library" + page + JSON.stringify(filters).replace(/({|}|,|"|:)/g, "");
    if (hasCache(currentSourceName, key)) {
      e.reply("res:library", getCache(currentSourceName, key));
    } else {
      const res = await currentSource.library(page, filters);
      setCache(currentSourceName, key, res.items);
      e.reply("res:library", res.items);
    }
  });

  ipcMain.on("get:read:init", async (e, { id, ext }) => {
    const key = "read" + id;
    const source = ext || currentSourceName;
    currentSource = base[source];
    if (hasDownload(id, source)) {
      e.reply("res:read:init", getDownload(id, source));
    } else if (hasCache(source, key)) {
      e.reply("res:read:init", getCache(source, key));
    } else {
      const res = await currentSource.read(id);
      setCache(source, key, res);
      e.reply("res:read:init", res);
    }
  });

  ipcMain.on("get:read:page", async (e, { img }) => {
    e.reply("res:read:page", img);
  });

  ipcMain.on("get:read:local", async (e, { rid, root, id, total }) => {
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    const main =
      app.getPath("desktop") +
      "/xreader" +
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
      e.reply("res:read:local", false);
    }
  });

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

  ipcMain.on("get:exts", (e) => {
    const exts = Object.keys(base);
    const res = exts.map((ext) => {
      return {
        ext,
        pinned: hasPinExt(ext),
      };
    });
    e.reply("res:exts", res);
  });

  ipcMain.on("add:pin:ext", (e, { ext }) => {
    setPinExt(ext);
    const exts = Object.keys(base);
    const res = exts.map((ext_) => {
      return {
        ext: ext_,
        pinned: hasPinExt(ext_),
      };
    });
    e.reply("res:exts", res);
  });

  ipcMain.on("remove:pin:ext", (e, { ext }) => {
    removePinExt(ext);
    const exts = Object.keys(base);
    const res = exts.map((ext_) => {
      return {
        ext: ext_,
        pinned: hasPinExt(ext_),
      };
    });
    e.reply("res:exts", res);
  });

  ipcMain.on("get:downloaded", (e) => {
    const res = getAllExtDownloads(currentSourceName);
    e.reply("res:downloaded", res);
  });
};
