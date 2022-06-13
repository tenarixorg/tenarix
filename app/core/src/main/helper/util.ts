import { BrowserWindow } from "electron";
import { resolve } from "path";

type DoneListener = (
  event: Electron.Event,
  state: "interrupted" | "completed" | "cancelled",
  webContents: Electron.WebContents,
  item: Electron.DownloadItem
) => void;

type UpdatedListener = (
  event: Electron.Event,
  state: "interrupted" | "progressing",
  webContents: Electron.WebContents,
  item: Electron.DownloadItem
) => void;

export const downloadItem = (
  win: BrowserWindow,
  url: string,
  path: string,
  done?: DoneListener,
  updated?: UpdatedListener
) => {
  win.webContents.downloadURL(url);
  return new Promise<boolean>((res) => {
    win?.webContents.session.addListener(
      "will-download",
      (_e, item, webContents) => {
        item.setSavePath(resolve(path));
        item.on("done", (ev, st) => {
          done && done(ev, st, webContents, item);
          win.webContents.session.removeAllListeners("will-download");
          item.removeAllListeners("done");
          item.removeAllListeners("updated");
          res(true);
        });
        item.on("updated", (ev, st) => {
          updated && updated(ev, st, webContents, item);
        });
      }
    );
  });
};
