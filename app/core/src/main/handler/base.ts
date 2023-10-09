import type { App, NativeTheme, BrowserWindow, IpcMain } from "electron";
import type { Folders, Chromium } from "types";
import { VariableHandler } from "./var";
import { pathToFileURL } from "url";
import { join } from "path";
import dns from "dns";

export class BaseHandler extends VariableHandler {
  constructor(
    app: App,
    win: BrowserWindow,
    ipcMain: IpcMain,
    nativeTheme: NativeTheme
  ) {
    super(nativeTheme.shouldUseDarkColors, win, app, ipcMain);
  }

  protected removeKey<O extends object = any, R = any, K extends keyof O = any>(
    obj: O,
    key: K
  ): R {
    delete obj[key];
    return obj as unknown as R;
  }

  protected async dynamicImport<T>(...path: string[]) {
    return (await import(pathToFileURL(join(...path)).toString())).default as T;
  }

  protected addFolders(folders: Folders) {
    this.files = folders;
  }

  protected addChromium(chromium: Chromium) {
    this.chromium = chromium;
  }

  protected async checkInternetConnection(off?: boolean) {
    if (off) return Promise.resolve(false);
    return new Promise<boolean>((res) => {
      dns.lookup("google.com", { family: 4, hints: 0 }, (err, address) => {
        if (err && !address) {
          res(false);
        } else {
          res(true);
        }
      });
    });
  }
}
