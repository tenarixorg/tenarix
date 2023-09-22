import fs from "fs";
import axios from "axios";
import { chromiumMirror, initialFolders, initialTheme } from "app-constants";
import { getContent, initFolders } from "./helper";
import { resolve, join } from "path";
import { platform } from "os";
import { watch } from "chokidar";
import { load } from "cheerio";
import {
  decodeRoute,
  encodeRoute,
  matchSystemLang,
  checkInternetConnection,
} from "utils";
import {
  app,
  shell,
  ipcMain,
  session,
  protocol,
  nativeTheme,
  BrowserWindow,
} from "electron";
import {
  Theme,
  AppExts,
  AppLangs,
  Language,
  EventItem,
  Extension,
  OmitExtID,
  OmitLangID,
  ChromiumMeta,
  EventCallback,
} from "types";

export class EventStack {
  private evs: EventItem[];

  constructor() {
    this.evs = [];
  }

  public push(name: string, callback: EventCallback) {
    if (!name || !callback) return;
    this.evs.push({ event: name, callback });
  }

  public getEvents() {
    return this.evs;
  }

  public merge(events: EventStack) {
    this.evs.push(...events.getEvents());
  }
}

export const mergeEventStacks = (...eventStacks: EventStack[]) => {
  const events = new EventStack();
  for (const ev of eventStacks) {
    events.merge(ev);
  }
  return events;
};

export class AppHandler {
  public readonly maxDownloads = 2;
  public readonly appFolder: string;
  public readonly themeFolder: string;
  public readonly settingsPath: string;
  public readonly downloadFolder: string;
  public readonly extensionsFolder: string;
  public readonly languagesFolder: string;
  public readonly win: BrowserWindow;

  public languageID;
  public extensionID;
  public offline: boolean;
  public internet: boolean;
  public lastRoute: string;
  public customTheme: Theme;
  public extensions: AppExts;
  public languages: AppLangs;
  public currentDowns: number;
  public chromiumExec: string;
  public chromium: ChromiumMeta;
  public language: OmitLangID | undefined;
  public extension: OmitExtID | undefined;
  public currentThemeSchema: "dark" | "light";
  public extensionNameMap: { [key: string]: string } = {};

  private URLfilter_ = {
    urls: ["*://*/*"],
  };

  constructor(win: BrowserWindow) {
    this.appFolder = resolve(join(app.getPath("home"), ".tenarix"));
    this.themeFolder = resolve(join(this.appFolder, "themes"));
    this.settingsPath = resolve(
      join(this.appFolder, "config", "settings.json")
    );
    this.downloadFolder = resolve(join(this.appFolder, ".dreader"));
    this.extensionsFolder = resolve(join(this.appFolder, "extensions"));
    this.languagesFolder = resolve(join(this.appFolder, "languages"));
    this.internet = true;
    this.offline = false;
    this.currentDowns = 0;
    this.languageID = "en";
    this.extensionID = "inmanga";
    this.languages = {};
    this.extensions = {};
    this.lastRoute = "/";
    this.currentThemeSchema = nativeTheme.shouldUseDarkColors
      ? "dark"
      : "light";
    this.customTheme = { ...initialTheme };
    this.chromium = chromiumMirror(platform());
    this.chromiumExec = resolve(
      this.appFolder,
      this.chromium.folder,
      this.chromium.exec
    );
    this.win = win;
    this.initWindow();
    this.initSession();
    this.initProtocol();
    this.initLanguages();
    this.initExtensions();
    this.checkInternet();
    this.initExtensionWatcher();
  }

  private removeKey<K = any, T = any>(obj: K, key: string): T {
    delete (obj as any)[key];
    return obj as any as T;
  }

  private addEvent(name: string, cb: EventCallback) {
    ipcMain.on(name, (ev, params) => cb(this, ev, params));
  }

  private async initLanguages() {
    const languages = fs.readdirSync(this.languagesFolder);

    for (const language of languages) {
      const lang = (await import(join(this.languagesFolder, language)))
        .default as Language;
      this.languages = {
        ...this.languages,
        [lang.id]: this.removeKey(lang, "id"),
      };
    }
    this.languageID = matchSystemLang(
      Object.keys(this.languages),
      app.getLocale(),
      "en"
    );
    this.language = this.languages[this.languageID];
  }

  private async initExtensions() {
    const extensions = fs.readdirSync(this.extensionsFolder);
    this.win?.webContents.send("res:installed:plugins", extensions);
    axios.defaults.adapter = require("axios/lib/adapters/http");
    for (const extension of extensions) {
      const ext = (await import(join(this.extensionsFolder, extension)))
        .default as Extension;
      const res = ext(getContent, load, axios, { encodeRoute, decodeRoute });
      this.extensionNameMap = {
        ...this.extensionNameMap,
        [extension]: res.name,
      };
      this.extensions = {
        ...this.extensions,
        [res.name]: this.removeKey(res, "name"),
      };
    }
    this.extension = this.extensions[this.extensionID];
  }

  private initWindow() {
    this.win.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    this.win?.on("ready-to-show", async () => {
      this.win?.show();
      await initFolders(
        this.appFolder,
        initialFolders(this.languageID, this.currentThemeSchema)
      );
    });

    ipcMain.on("closeApp", () => {
      this.win?.close();
    });

    ipcMain.on("minimizeApp", () => {
      this.win?.minimize();
    });

    ipcMain.on("maximizeApp", () => {
      if (this.win?.isMaximized()) {
        this.win.restore();
      } else {
        this.win?.maximize();
      }
    });

    this.win?.on("resize", () => {
      if (this.win?.isNormal()) {
        this.win.webContents.send("resize", false);
      } else {
        this.win?.webContents.send("resize", true);
      }
      this.win?.webContents.send("close:sidebar", true);
    });

    this.win?.on("move", () => {
      this.win?.webContents.send("close:sidebar", true);
    });
  }

  private initSession() {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      this.URLfilter_,
      (det, cb) => {
        const url = new URL(det.url);
        det.requestHeaders["Origin"] = url.origin;
        if (this.extension?.opts) {
          for (const key of Object.keys(this.extension.opts.headers)) {
            if (
              key.toLowerCase() === "referer" &&
              !!this.extension.opts.refererRule
            ) {
              det.requestHeaders[key] = this.extension.opts.refererRule(
                url.href
              );
            } else {
              det.requestHeaders[key] = this.extension.opts.headers[key];
            }
          }
        }
        cb({ cancel: false, requestHeaders: det.requestHeaders });
      }
    );
  }

  private initProtocol() {
    protocol.registerFileProtocol("file", (request, callback) => {
      const pathname = decodeURI(request.url.replace("file:///", ""));
      callback(pathname);
    });
  }

  private async checkInternet() {
    const interval = setInterval(async () => {
      this.internet = await checkInternetConnection(this.offline);
      this.win?.webContents.send("internet:connection", this.internet);
    }, 200);
    this.win.on("closed", () => {
      clearInterval(interval);
    });
  }

  private initExtensionWatcher() {
    watch(this.extensionsFolder).on("addDir", (path: string) => {
      if (path.includes("dist") && process.uptime() > 3) {
        setTimeout(() => {
          this.initExtensions();
        }, 100);
      }
    });
    watch(this.extensionsFolder).on("unlinkDir", (path) => {
      if (!path.includes("dist")) {
        const normalized = path.split("\\").join("/");
        const ext = normalized.split("/").pop();
        setTimeout(() => {
          this.removeKey(this.extensions, this.extensionNameMap[ext || ""]);
          this.initExtensions();
        }, 100);
      }
    });
  }

  public init(events: EventStack) {
    for (const { event, callback } of events.getEvents())
      this.addEvent(event, callback);
  }
}
