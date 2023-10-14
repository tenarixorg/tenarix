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
  }

  private addEvent(name: string, cb: EventCallback) {
    this.ipcMain.on(name, (ev, params) => cb(this, ev, params));
  }

  public init(events: EventStack) {
    for (const { event, callback } of events.getEvents())
      this.addEvent(event, callback);
  }
}
