import type { BrowserWindow, IpcMain, Shell } from "electron";
import type { InitFolderFn } from "types";

export class WindowHandler {
  private readonly shell: Shell;
  public readonly ipcMain: IpcMain;
  public readonly win: BrowserWindow;
  public readonly initFolders: InitFolderFn;

  constructor(
    win: BrowserWindow,
    ipcMain: IpcMain,
    shell: Shell,
    initFolders: InitFolderFn
  ) {
    this.ipcMain = ipcMain;
    this.shell = shell;
    this.win = win;
    this.initFolders = initFolders;
  }

  public initWindow(baseFolder: string, langId: string, themeSchema: string) {
    this.win.webContents.setWindowOpenHandler((details) => {
      this.shell.openExternal(details.url);
      return { action: "deny" };
    });

    this.win?.on("ready-to-show", async () => {
      this.win?.show();
      await this.initFolders(baseFolder, langId, themeSchema);
    });

    this.ipcMain?.on("closeApp", () => {
      this.win?.close();
    });

    this.ipcMain?.on("minimizeApp", () => {
      this.win?.minimize();
    });

    this.ipcMain?.on("maximizeApp", () => {
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
}
