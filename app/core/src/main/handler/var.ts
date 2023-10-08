import type { App, BrowserWindow, IpcMain } from "electron";
import { initialTheme } from "app-constants";
import type {
  Theme,
  Folders,
  AppExts,
  AppLangs,
  Chromium,
  OmitExtID,
  OmitLangID,
} from "types";

export class VariableHandler {
  public files: Folders;
  public offline: boolean;
  public chromium: Chromium;
  public internet: boolean;
  public language: OmitLangID | undefined;
  public extension: OmitExtID | undefined;
  public lastRoute: string;
  public languages: AppLangs;
  public URLfilter: { urls: string[] };
  public languageID: string;
  public extensions: AppExts;
  public extensionID: string;
  public customTheme: Theme;
  public currentDowns: number;
  public extensionNameMap: { [key: string]: string } = {};
  public currentThemeSchema: "dark" | "light";
  public readonly app: App;
  public readonly win: BrowserWindow;
  public readonly ipcMain: IpcMain;
  public readonly maxDownloads = 2;

  constructor(dark: boolean, win: BrowserWindow, app: App, ipcMain: IpcMain) {
    this.app = app;
    this.win = win;
    this.ipcMain = ipcMain;
    this.currentThemeSchema = dark ? "dark" : "light";
    this.internet = true;
    this.offline = false;
    this.currentDowns = 0;
    this.languageID = "en";
    this.extensionID = "inmanga";
    this.languages = {};
    this.extensions = {};
    this.lastRoute = "/";
    this.customTheme = { ...initialTheme };
    this.URLfilter = {
      urls: ["*://*/*"],
    };
    this.files = {
      appFolder: "",
      downloadFolder: "",
      extensionsFolder: "",
      languagesFolder: "",
      settingsPath: "",
      themeFolder: "",
      initFolders: () => Promise.reject("Not implemented yet"),
    };
    this.chromium = {
      exec: "",
      meta: {
        exec: "",
        folder: "",
        url: "",
      },
    };
  }
}
