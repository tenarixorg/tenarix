import { checkInternetConnection } from "utils";
import type { BrowserWindow, App, NativeTheme, IpcMain } from "electron";
import { EventCallback } from "types";
import { EventStack } from "./event";
import { AppHandler } from "./app";

export { EventStack };

export default class Handler extends AppHandler {
  constructor(
    app: App,
    win: BrowserWindow,
    ipcMain: IpcMain,
    nativeTheme: NativeTheme
  ) {
    super(app, win, ipcMain, nativeTheme);
    this.checkInternet();
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

  private addEvent(name: string, cb: EventCallback) {
    this.ipcMain.on(name, (ev, params) => cb(this, ev, params));
  }

  public init(events: EventStack) {
    for (const { event, callback } of events.getEvents())
      this.addEvent(event, callback);
  }
}
