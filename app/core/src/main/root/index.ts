import fs from "fs";
import lang from "./language";
import baseExt from "./extension";
import Ajv from "ajv";
import { ipcMain, BrowserWindow, app, nativeTheme, session } from "electron";
import { matchSystemLang, getAllExt, format_ext } from "utils";
import { settingsSchema, themeSchema } from "schemas";
import { SettingsStore, Theme } from "types";
import { resolve } from "path";
import { getHash } from "workers";
import { initialFolders, initialTheme } from "app-constants";
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
  getCurrentSources,
  setCurrentSource,
} from "../store";
import {
  decryptChapter,
  downloadEncrypt,
  initFolders,
  loadLocalFile,
} from "./helper";

export const handler = (win?: BrowserWindow) => {
  let currentExtName = "inmanga";
  let lastRoute = "/";
  const slang = matchSystemLang(Object.keys(lang), app.getLocale(), "en");
  let currentLangId = slang;
  let currentExt = baseExt[currentExtName];
  let currentLang = lang[currentLangId];
  let customTheme = { ...initialTheme };
  let currentThemeSchema: "dark" | "light" = nativeTheme.shouldUseDarkColors
    ? "dark"
    : "light";

  const filter = {
    urls: ["*://*/*"],
  };

  const themeFolder = resolve(app.getPath("home") + "/.tenarix/themes");
  const settingsPath = resolve(
    app.getPath("home") + "/.tenarix/config/settings.json"
  );
  const downloadFolder = resolve(
    app.getPath("home") + "/.tenarix" + "/.dreader"
  );

  const maxDowns = 2;
  let currentDowns = 0;

  win?.on("ready-to-show", async () => {
    win?.show();
    const basePath = resolve(app.getPath("home") + "/.tenarix");
    await initFolders(basePath, initialFolders(slang, currentThemeSchema));
  });

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (det, cb) => {
    const url = new URL(det.url);
    det.requestHeaders["Origin"] = url.origin;
    if (currentExt.opts) {
      for (const key of Object.keys(currentExt.opts.headers)) {
        if (key.toLowerCase() === "referer" && !!currentExt.opts.refererRule) {
          det.requestHeaders[key] = currentExt.opts.refererRule(url.href);
        } else {
          det.requestHeaders[key] = currentExt.opts.headers[key];
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

  ipcMain.on("get:theme", async (e) => {
    const file = getSettings()?.theme.file || "basic.json";
    const schema = getSettings()?.theme.schema || currentThemeSchema;
    try {
      const theme_ = await loadLocalFile<Theme>(
        resolve(themeFolder + "/" + file),
        "object"
      );
      customTheme = theme_;
      e.reply("change:theme", customTheme[schema]);
    } catch (error) {
      e.reply("change:theme", initialTheme[schema]);
    }
  });

  ipcMain.on("get:theme:schema", (e) => {
    const file = getSettings()?.theme.file || "basic.json";
    const schema = getSettings()?.theme.schema || currentThemeSchema;
    const res = {
      schema,
      themeName: {
        label: format_ext(file.replace(/\.json/gi, "")),
        value: file,
      },
    };

    e.reply("res:theme:schema", res);
  });

  ipcMain.on("change:theme:schema", async (e, { schema }) => {
    currentThemeSchema = schema;
    setSettings({
      lang: getSettings()?.lang || currentLangId,
      theme: {
        schema: currentThemeSchema || getSettings()?.theme.schema,
        file: getSettings()?.theme.file || "basic.json",
      },
    });
    const file = getSettings()?.theme.file || "basic.json";
    e.reply("change:theme", customTheme[currentThemeSchema]);
    try {
      const theme_ = await loadLocalFile<Theme>(
        resolve(themeFolder + "/" + file),
        "object"
      );
      customTheme = theme_;
      e.reply("change:theme", customTheme[currentThemeSchema]);
    } catch (error) {
      e.reply("change:theme", initialTheme[currentThemeSchema]);
    }
    e.reply("res:theme:schema", {
      schema,
      themeName: {
        label: format_ext(file.replace(/\.json/gi, "")),
        value: file,
      },
    });
  });

  ipcMain.on("get:external:themes", async (e) => {
    const files = fs.readdirSync(themeFolder);
    const res: { label: string; value: string }[] = [];
    for (const file of files) {
      res.push({
        label: format_ext(file.replace(/\.json/gi, "")),
        value: file,
      });
    }
    e.reply("res:external:themes", res);
  });

  ipcMain.on("get:external:themes:files", async (e) => {
    const files = fs.readdirSync(themeFolder);
    e.reply("res:external:themes:files", files);
  });

  ipcMain.on("set:external:theme", async (e, { file }) => {
    const basePath = resolve(themeFolder + "/" + file);
    try {
      const newTheme = await loadLocalFile<Theme>(basePath, "object");
      customTheme = newTheme;
    } catch (err: any) {
      e.reply("res:error", { error: err.message });
    }
    setSettings({
      lang: getSettings()?.lang || currentLangId,
      theme: {
        schema: getSettings()?.theme.schema || currentThemeSchema,
        file,
      },
    });
    const file_ = getSettings()?.theme.file || "basic.json";
    const schema = getSettings()?.theme.schema || currentThemeSchema;
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
    const basePath = themeFolder;
    const file = fs.createWriteStream(resolve(basePath + "/" + filename));
    file.write(
      JSON.stringify({ ...customTheme, [schema]: data }, null, "\t"),
      (err) => {
        file.close();
        if (err) {
          e.reply("res:error", { error: err.message });
        } else {
          currentThemeSchema = schema;
          customTheme[currentThemeSchema] = data;
          setSettings({
            lang: getSettings()?.lang || currentLangId,
            theme: {
              file: filename,
              schema: currentThemeSchema,
            },
          });
          e.reply("change:theme", customTheme[currentThemeSchema]);
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

  ipcMain.on("save:full:settings", async (e, { data }) => {
    const base_ = JSON.parse(data) as { app: SettingsStore };
    const files = fs.readdirSync(themeFolder);
    const ajv = new Ajv();
    const validator = ajv.compile(settingsSchema(files));
    const valid = validator(base_);
    if (valid) {
      setSettings(base_.app);
      e.reply(
        "res:lang",
        lang[getSettings()?.lang || currentLangId] || currentLang
      );
      const file_ = getSettings()?.theme.file || "basic.json";
      const schema = getSettings()?.theme.schema || currentThemeSchema;
      const theme_ = await loadLocalFile<Theme>(
        resolve(themeFolder + "/" + file_),
        "object"
      );
      customTheme = theme_;
      e.reply("change:theme", customTheme[schema]);
      e.reply("res:theme:schema", {
        schema,
        themeName: {
          label: format_ext(file_.replace(/\.json/gi, "")),
          value: file_,
        },
      });
    } else {
      e.reply("res:error", { error: ajv.errorsText(validator.errors) });
    }
  });

  ipcMain.on("save:full:external:theme", (e, { filename, data }) => {
    try {
      const base_ = JSON.parse(data) as Theme;
      const ajv = new Ajv();
      const validator = ajv.compile(themeSchema);
      const valid = validator(base_);
      if (!valid) {
        e.reply("res:error", { error: ajv.errorsText(validator.errors) });
      } else {
        const basePath = themeFolder;
        const file = fs.createWriteStream(resolve(basePath + "/" + filename));
        file.write(data, (err) => {
          file.close();
          if (err) {
            e.reply("res:error", { error: err.message });
          } else {
            e.reply("res:error", { error: "Theme saved" });
            customTheme = base_;
            setSettings({
              lang: getSettings()?.lang || currentLangId,
              theme: {
                file: filename,
                schema: currentThemeSchema,
              },
            });
            e.reply("change:theme", customTheme[currentThemeSchema]);
          }
        });
      }
    } catch (err: any) {
      e.reply("res:error", { error: err.message });
    }
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
      theme: {
        file: getSettings()?.theme.file || "basic.json",
        schema: getSettings()?.theme.schema || currentThemeSchema,
      },
    });
    e.reply("res:lang", currentLang);
  });

  ipcMain.on("get:all:lang", (e) => {
    const keys = Object.keys(lang);
    const res = keys.map((curr) => ({ id: curr, name: lang[curr].name }));
    e.reply("res:all:lang", res);
  });

  /** App extension source */

  ipcMain.on("change:source", (_e, { source }) => {
    currentExt = baseExt[source];
    currentExtName = source;
  });

  /** App downloads */

  ipcMain.on(
    "download",
    async (e, { rid, root, id, imgs, title, info, pages, ext }) => {
      if (currentDowns < maxDowns) {
        currentDowns++;
        const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
        const main = downloadFolder + `/${await getHash(root)}`;
        const base = main + `/${_rid}`;
        if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
        if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
        const source = ext || currentExtName;
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
            currentExt.opts?.refererRule
              ? { Referer: currentExt.opts.refererRule(imgs[0].url) }
              : currentExt.opts?.headers
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
    const res = getAllExtDownloads(ext || currentExtName);
    e.reply("res:downloaded", res);
  });

  /** App home */

  ipcMain.on("get:home", async (e) => {
    try {
      if (hasCache(currentExtName, "home")) {
        e.reply("res:home", getCache(currentExtName, "home"));
      } else {
        const res = await currentExt.home();
        setCache(currentExtName, "home", res);
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
      if (hasFavorite(currentExtName, route)) {
        e.reply("res:details", {
          res: getFavorite(currentExtName, route),
          fav: true,
        });
      } else if (hasCache(currentExtName, key)) {
        e.reply("res:details", {
          res: getCache(currentExtName, key),
          fav: false,
        });
      } else {
        const res = await currentExt.details(route);
        setCache(currentExtName, key, res);
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
      if (hasCache(currentExtName, key)) {
        e.reply("res:library", getCache(currentExtName, key));
      } else {
        const res = await currentExt.library(page, filters);
        setCache(currentExtName, key, res.items);
        e.reply("res:library", res.items);
      }
    } catch (error: any) {
      e.reply("res:error", { msg: error.message });
    }
  });

  /** App read */

  ipcMain.on("get:read:init", async (e, { id, ext }) => {
    const key = "read" + id;
    const source = ext || currentExtName;
    currentExt = baseExt[source];
    try {
      if (hasDownload(id, source) && getDownload(id, source)?.done) {
        e.reply("res:read:init", getDownload(id, source)?.data);
      } else if (hasCache(source, key)) {
        e.reply("res:read:init", getCache(source, key));
      } else {
        const res = await currentExt.read(id);
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
      const stored = getReadPercentage(ext || currentExtName, route, id);
      if (!stored?.percentage || stored.percentage < percentage) {
        setReadPersentage(ext || currentExtName, route, id, {
          percentage: (page / total) * 100,
          lastPage: page,
        });
      }
      e.reply("res:read:page", img);
    }
  );

  ipcMain.on("get:read:local", async (e, { rid, root, id, total, ext }) => {
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    if (getDownload(rid, ext || currentExtName)?.inProgress) {
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
    if (hasFavorite(currentExtName, route)) return;
    setFavorite(currentExtName, route, data);
    e.reply("res:favorite", true);
  });

  ipcMain.on("remove:favorite", (e, { route, ext }) => {
    const _ext = ext || currentExt;
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
      getAllReadPercentage(ext || currentExtName, route)
    );
  });

  ipcMain.on(
    "set:read:percentage",
    (e, { ext, route, id, percentage, page, check }) => {
      if (check) {
        const stored =
          getReadPercentage(ext || currentExtName, route, id)?.percentage || -1;
        if (stored !== -1 && stored < percentage)
          setReadPersentage(ext || currentExtName, route, id, {
            percentage,
            lastPage: page,
          });
      } else {
        setReadPersentage(ext || currentExtName, route, id, {
          percentage,
          lastPage: page,
        });
      }
      e.reply(
        "res:read:percentage",
        getAllReadPercentage(ext || currentExtName, route)
      );
    }
  );

  ipcMain.on("get:read:percentage:page", (e, { route, ext, id }) => {
    const lastPage =
      getReadPercentage(ext || currentExtName, route, id)?.lastPage || 1;
    e.reply("res:read:percentage:page", lastPage);
  });

  /* App Editor */

  ipcMain.on("load:editor", async (e, { src, data }) => {
    if (src === "theme") {
      const themePath = resolve(themeFolder + "/" + data.filename);
      const res = await loadLocalFile(themePath, "string");
      e.reply("res:load:editor", res);
    } else if (src === "setup") {
      const res = await loadLocalFile(settingsPath, "string");
      e.reply("res:load:editor", res);
    }
  });

  /* App chapter current source*/

  ipcMain.on(
    "set:current:chapter:source",
    (e, { ext, route, chapter, current }) => {
      setCurrentSource(ext || currentExtName, route, chapter, current);
      const res = getCurrentSources(ext || currentExtName, route);
      e.reply("res:current:chapters:sources", res);
    }
  );

  ipcMain.on("get:current:chapters:sources", (e, { ext, route }) => {
    const res = getCurrentSources(ext || currentExtName, route);
    e.reply("res:current:chapters:sources", res);
  });

  /* App routes */

  ipcMain.on("set:last:route", (_e, { route }) => {
    lastRoute = route;
  });

  ipcMain.on("get:last:route", (e) => {
    e.reply("res:last:route", lastRoute);
  });
};
