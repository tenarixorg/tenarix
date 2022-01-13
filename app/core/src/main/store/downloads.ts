import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";

const store = new Store({
  cwd: resolve(app.getPath("desktop") + "/xreader"),
  name: "downloads",
});

export const setDownload = (id: string, ext: string, value: any) => {
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
  const res: string[] = [];
  const keys = Object.keys(store.store);
  for (const key of keys) {
    if (key.endsWith(`::${ext}`)) {
      const s = key.substring(0, key.length - `${ext}::`.length);
      res.push(s);
    }
  }

  return res;
};
