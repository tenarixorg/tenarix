import { App, IpcMain, NativeTheme, BrowserWindow } from "electron";
import { InitHandler } from "./init";

export class AppHandler extends InitHandler {
  constructor(
    app: App,
    win: BrowserWindow,
    ipcMain: IpcMain,
    nativeTheme: NativeTheme
  ) {
    super(app, win, ipcMain, nativeTheme);
    this.handle();
    this.checkInternet();
  }

  private async checkInternet() {
    const interval = setInterval(async () => {
      this.internet = await this.checkInternetConnection(this.offline);
      this.win?.webContents.send("internet:connection", this.internet);
    }, 200);
    this.win.on("closed", () => {
      clearInterval(interval);
    });
  }
}
