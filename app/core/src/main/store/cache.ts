import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";

const store = new Store({
  cwd: resolve(app.getPath("home") + "/.tenarix"),
  name: "cache",
});

export const setCache = <T>(ext: string, target: string, value: T) => {
  store.set(`${ext}_${target}`, value);
};

export const getCache = <T>(ext: string, target: string): T | undefined => {
  if (store.has(`${ext}_${target}`)) return store.get(`${ext}_${target}`) as T;
  return undefined;
};

export const hasCache = (ext: string, target: string): boolean => {
  return store.has(`${ext}_${target}`);
};

export const removeExtCache = (ext: string): void => {
  const keys = store.store;
  for (const key in keys) {
    if (key.includes(ext)) store.delete(key);
  }
};
