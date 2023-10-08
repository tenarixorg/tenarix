import { resolve } from "path";
import { ChromiumMeta } from "types";

export class ChromiumHandler {
  public exec: string;
  public meta: ChromiumMeta;
  constructor(appFolder: string, platform: string) {
    this.meta = this.chromiumMirror(platform);
    this.exec = resolve(appFolder, this.meta.folder, this.meta.exec);
  }

  private chromiumMirror(platform: string) {
    switch (platform) {
      case "win32":
        return {
          url: "https://commondatastorage.googleapis.com/chromium-browser-snapshots/Win_x64/967618/chrome-win.zip",
          folder: "chrome-win",
          exec: "chrome.exe",
        };
      case "darwin":
        return {
          url: "https://commondatastorage.googleapis.com/chromium-browser-snapshots/Mac/967618/chrome-mac.zip",
          folder: "chrome-mac",
          exec: "Chromium.app/Contents/MacOS/Chromium",
        };
      default:
        return {
          url: "https://commondatastorage.googleapis.com/chromium-browser-snapshots/Linux_x64/967619/chrome-linux.zip",
          folder: "chrome-linux",
          exec: "chrome",
        };
    }
  }
}
