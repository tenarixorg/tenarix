import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";
import { DownloadStore } from "types";

const store = new Store<Record<string, DownloadStore>>({
  cwd: resolve(app.getPath("desktop") + "/.tenarix"),
  name: "downloads",
});

export const setDownload = (id: string, ext: string, value: DownloadStore) => {
  store.set(`${id}::${ext}`, value);
};

export const getDownload = (id: string, ext: string) => {
  if (hasDownload(id, ext)) return store.get(`${id}::${ext}`);
  return undefined;
};

export const hasDownload = (id: string, ext: string): boolean => {
  return store.has(`${id}::${ext}`);
};

export const getAllExtDownloads = (ext: string) => {
  const res: DownloadStore[] = [];
  const keys = Object.keys(store.store);
  for (const key of keys) {
    if (key.endsWith(`::${ext}`)) {
      const down = store.store[key];
      res.push(down);
    }
  }

  return res;
};
