import fs from "fs";
import lang from "./language";
import baseExt from "./extension";
import { ipcMain, BrowserWindow, app, nativeTheme, session } from "electron";
import { matchSystemLang, getAllExt, format_ext } from "utils";
import { resolve } from "path";
import { getHash } from "workers";
import { theme } from "context-providers";
import { Theme } from "types";
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
  getAllReadPercentage,
  getReadPercentage,
  setReadPersentage,
} from "../store";
import {
  decryptChapter,
  downloadEncrypt,
  initFolders,
  loadJsonFile,
} from "./helper";

export const handler = (win?: BrowserWindow) => {
  let currentSourceName = "inmanga";
  const slang = matchSystemLang(Object.keys(lang), app.getLocale(), "en");
  let currentLangId = slang;
  let currentSource = baseExt[currentSourceName];
  let currentLang = lang[currentLangId];
  let customTheme = getSettings()?.colors || { ...theme };
  let currentTheme: "dark" | "light" = nativeTheme.shouldUseDarkColors
    ? "dark"
    : "light";

  const filter = {
    urls: ["*://*/*"],
  };

  const maxDowns = 2;
  let currentDowns = 0;

  win?.on("ready-to-show", async () => {
    win?.show();
    const basePath = resolve(app.getPath("home") + "/.tenarix");
    await initFolders(basePath, [
      { name: ".dreader" },
      {
        name: "themes",
        files: [
          { name: "basic.json", content: JSON.stringify(theme, null, 2) },
        ],
      },
    ]);
  });

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

  win?.on("resize", () => {
    if (win?.isNormal()) {
      win.webContents.send("resize", false);
    } else {
      win?.webContents.send("resize", true);
    }
    win?.webContents.send("close:sidebar", true);
  });

  win?.on("move", () => {
    win?.webContents.send("close:sidebar", true);
  });

  /** App theme */

  ipcMain.on("get:theme", (e) => {
    e.reply("change:theme", customTheme[getSettings()?.theme || currentTheme]);
  });

  ipcMain.on("get:theme:schema", (e) => {
    const file = getSettings()?.themeName || "basic.json";
    const schema = getSettings()?.theme || currentTheme;
    const res = {
      schema,
      themeName: {
        label: format_ext(file.replace(/\.json/gi, "")),
        value: file,
      },
    };

    e.reply("res:theme:schema", res);
  });

  ipcMain.on("change:theme:schema", (e, { schema }) => {
    currentTheme = schema;
    setSettings({
      lang: getSettings()?.lang || currentLangId,
      theme: currentTheme,
      colors: customTheme,
      themeName: getSettings()?.themeName || "basic.json",
    });
    const file = getSettings()?.themeName || "basic.json";
    e.reply("change:theme", customTheme[currentTheme]);
    e.reply("res:theme:schema", {
      schema,
      themeName: {
        label: format_ext(file.replace(/\.json/gi, "")),
        value: file,
      },
    });
  });

  ipcMain.on("get:external:themes", async (e) => {
    const basePath = resolve(app.getPath("home") + "/.tenarix/themes");
    const files = fs.readdirSync(basePath);
    const res: { label: string; value: string }[] = [];
    for (const file of files) {
      res.push({
        label: format_ext(file.replace(/\.json/gi, "")),
        value: file,
      });
    }
    e.reply("res:external:themes", res);
  });

  ipcMain.on("set:external:theme", async (e, { file }) => {
    const basePath = resolve(app.getPath("home") + "/.tenarix/themes/" + file);
    try {
      const newTheme = await loadJsonFile<Theme>(basePath);
      customTheme = newTheme;
    } catch (err: any) {
      e.reply("res:error", { error: err.message });
    }
    setSettings({
      lang: getSettings()?.lang || currentLangId,
      theme: currentTheme,
      colors: customTheme,
      themeName: file,
    });
    const file_ = getSettings()?.themeName || "basic.json";
    const schema = getSettings()?.theme || currentTheme;
    e.reply("change:theme", customTheme[schema]);
    e.reply("res:theme:schema", {
      schema,
      themeName: {
        label: format_ext(file_.replace(/\.json/gi, "")),
        value: file_,
      },
    });
  });

  ipcMain.on("save:external:theme", (e, { filename, data, schema }) => {
    const basePath = resolve(app.getPath("home") + "/.tenarix/themes/");
    const file = fs.createWriteStream(resolve(basePath + "/" + filename));
    file.write(
      JSON.stringify({ ...customTheme, [schema]: data }, null, 2),
      (err) => {
        file.close();
        if (err) {
          e.reply("res:error", { error: err.message });
        } else {
          e.reply("res:error", { error: "Theme saved" });
          currentTheme = schema;
          customTheme[currentTheme] = data;
          setSettings({
            lang: getSettings()?.lang || currentLangId,
            theme: currentTheme,
            colors: customTheme,
            themeName: filename,
          });
          e.reply("change:theme", customTheme[currentTheme]);
          e.reply("res:theme:schema", {
            schema,
            themeName: {
              label: format_ext(filename.replace(/\.json/gi, "")),
              value: filename,
            },
          });
          const files = fs.readdirSync(basePath);
          const res: { label: string; value: string }[] = [];
          for (const file of files) {
            res.push({
              label: format_ext(file.replace(/\.json/gi, "")),
              value: file,
            });
          }
          e.reply("res:external:themes", res);
        }
      }
    );
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
      colors: customTheme,
      themeName: getSettings()?.themeName || "basic.json",
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
          resolve(app.getPath("home") + "/.tenarix") +
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

  ipcMain.on(
    "get:read:page",
    async (e, { img, page, total, ext, route, id }) => {
      const percentage = (page / total) * 100;
      const stored = getReadPercentage(ext || currentSourceName, route, id);
      if (!stored?.percentage || stored.percentage < percentage) {
        setReadPersentage(ext || currentSourceName, route, id, {
          percentage: (page / total) * 100,
          lastPage: page,
        });
      }
      e.reply("res:read:page", img);
    }
  );

  ipcMain.on("get:read:local", async (e, { rid, root, id, total, ext }) => {
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    if (getDownload(rid, ext || currentSourceName)?.inProgress) {
      e.reply("res:read:local", false);
      return;
    }
    const main =
      app.getPath("home") +
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

  ipcMain.on("set:favorite", (e, { route, data }) => {
    if (hasFavorite(currentSourceName, route)) return;
    setFavorite(currentSourceName, route, data);
    e.reply("res:favorite", true);
  });

  ipcMain.on("remove:favorite", (e, { route, ext }) => {
    const _ext = ext || currentSource;
    removeFavorite(_ext, route);
    e.reply("res:favorite", false);
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

  /* App read percentage */

  ipcMain.on("get:read:percentage", (e, { ext, route }) => {
    e.reply(
      "res:read:percentage",
      getAllReadPercentage(ext || currentSourceName, route)
    );
  });

  ipcMain.on(
    "set:read:percentage",
    (e, { ext, route, id, percentage, page, check }) => {
      if (check) {
        const stored =
          getReadPercentage(ext || currentSourceName, route, id)?.percentage ||
          -1;
        if (stored !== -1 && stored < percentage)
          setReadPersentage(ext || currentSourceName, route, id, {
            percentage,
            lastPage: page,
          });
      } else {
        setReadPersentage(ext || currentSourceName, route, id, {
          percentage,
          lastPage: page,
        });
      }
      e.reply(
        "res:read:percentage",
        getAllReadPercentage(ext || currentSourceName, route)
      );
    }
  );

  ipcMain.on("get:read:percentage:page", (e, { route, ext, id }) => {
    const lastPage =
      getReadPercentage(ext || currentSourceName, route, id)?.lastPage || 1;
    e.reply("res:read:percentage:page", lastPage);
  });
};
