import fs from "fs";
import axios from "axios";
import { matchSystemLang, decodeRoute, encodeRoute } from "utils";
import type { Language, Extension } from "types";
import { ChromiumHandler } from "./chromium";
import { WindowHandler } from "./window";
import { FolderHandler } from "./folder";
import { BaseHandler } from "./base";
import { getContent } from "../helper";
import { platform } from "os";
import { watch } from "chokidar";
import { load } from "cheerio";
import {
  App,
  net,
  shell,
  session,
  IpcMain,
  protocol,
  NativeTheme,
  BrowserWindow,
} from "electron";

export class AppHandler extends BaseHandler {
  constructor(
    app: App,
    win: BrowserWindow,
    ipcMain: IpcMain,
    nativeTheme: NativeTheme
  ) {
    super(app, win, ipcMain, nativeTheme);
    this.addFolders(new FolderHandler(app.getPath("home")));
    this.addChromium(new ChromiumHandler(this.files.appFolder, platform()));
    new WindowHandler(
      this.win,
      this.ipcMain,
      shell,
      this.files.initFolders
    ).initWindow(
      this.files.appFolder,
      this.languageID,
      this.currentThemeSchema
    );
    this.initSession();
    this.initProtocol();
    this.initLanguages();
    this.initExtensions();
    this.initExtensionWatcher();
  }

  protected async initExtensions() {
    if (!fs.existsSync(this.files.extensionsFolder)) return;
    const extensions = fs.readdirSync(this.files.extensionsFolder);
    this.win?.webContents.send("res:installed:plugins", extensions);
    axios.defaults.adapter = require("axios/lib/adapters/http");
    for (const extension of extensions) {
      const ext = await this.dynamicImport<Extension>(
        this.files.extensionsFolder,
        extension,
        "dist",
        "index.js"
      );
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
  protected initExtensionWatcher() {
    if (!fs.existsSync(this.files.extensionsFolder)) return;
    watch(this.files.extensionsFolder).on("addDir", (path: string) => {
      if (path.includes("dist") && process.uptime() > 3) {
        setTimeout(() => {
          this.initExtensions();
        }, 100);
      }
    });

    watch(this.files.extensionsFolder).on("unlinkDir", (path) => {
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

  private async initLanguages() {
    const languages = fs.readdirSync(this.files.languagesFolder);
    for (const language of languages) {
      const lang = (
        await this.dynamicImport<{ default: Language }>(
          this.files.languagesFolder,
          language,
          "dist",
          "index.js"
        )
      ).default;
      this.languages = {
        ...this.languages,
        [lang.id]: this.removeKey(lang, "id"),
      };
    }
    this.languageID = matchSystemLang(
      Object.keys(this.languages),
      this.app?.getLocale() || "en",
      "en"
    );
    this.language = this.languages[this.languageID];
  }

  private initSession() {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      this.URLfilter,
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
    protocol.handle("file", (request) => {
      const pathname = decodeURI(request.url.replace("file:///", ""));
      return net.fetch(pathname, { bypassCustomProtocolHandlers: true });
    });
  }
}
