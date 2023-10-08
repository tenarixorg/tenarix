import type { App, NativeTheme, BrowserWindow, IpcMain } from "electron";
import type { Folders, Chromium } from "types";
import { VariableHandler } from "./var";
import { pathToFileURL } from "url";
import { join } from "path";

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
}
