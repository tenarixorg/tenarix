import fs from "fs";
import base from "./extension";
import { ipcMain, BrowserWindow, app, nativeTheme, session } from "electron";
import { getCache, setCache, hasCache } from "../store";
import { decrypt, encrypt, getHash } from "../crypto";
import { Readable } from "stream";
import { resolve } from "path";
import { getImg } from "scraper";
import { theme } from "utils";

export const handler = (win?: BrowserWindow) => {
  let currentSourceName = "inmanga";
  let currentSource = base[currentSourceName];
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
        det.requestHeaders[key] = currentSource.opts.headers[key];
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

  ipcMain.on("download", async (e, { rid, root, id, imgs }) => {
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    const main =
      resolve(app.getPath("desktop")) + "/.dreader" + `/${await getHash(root)}`;
    const base = main + `/${_rid}`;
    if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
    if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    for (const img of imgs) {
      console.log("downloading...", img.page);
      const data = await getImg(img.url, currentSource.opts?.headers);
      const stream = Readable.from(data);
      await encrypt(
        "some random password",
        resolve(base, `./${id}_${img.page}`),
        stream
      );
      console.log("done");
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
    if (hasCache(currentSourceName, "home")) {
      e.reply("res:home", getCache(currentSourceName, "home"));
    } else {
      const res = await currentSource.home();
      setCache(currentSourceName, "home", res);
      e.reply("res:home", res);
    }
  });

  ipcMain.on("get:details", async (e, { route }) => {
    const key = "details" + route;
    if (hasCache(currentSourceName, key)) {
      e.reply("res:details", getCache(currentSourceName, key));
    } else {
      const res = await currentSource.details(route);
      setCache(currentSourceName, key, res);
      e.reply("res:details", res);
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

  ipcMain.on("get:read:init", async (e, { id }) => {
    const key = "read" + id;
    if (hasCache(currentSourceName, key)) {
      e.reply("res:read:init", getCache(currentSourceName, key));
    } else {
      const res = await currentSource.read(id);
      setCache(currentSourceName, key, res);
      e.reply("res:read:init", res);
    }
  });

  ipcMain.on("get:read:page", async (e, { img }) => {
    e.reply("res:read:page", img);
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
    const res: Buffer[] = [];
    console.log("using local");
    try {
      for (let i = 0; i < a.total; i++) {
        const file = base + `/${a.id}_${i + 1}`;
        const res_ = await decrypt("some random password", file);
        res.push(res_);
      }

      e.reply("res:read:local", res);
    } catch (error: any) {
      e.reply("res:read:local", false);
    }
  });
};
