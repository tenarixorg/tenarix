import Store from "electron-store";
import { app } from "electron";

const store = new Store({
  cwd: app.getPath("desktop"),
  name: "favorites",
});

export const setFavorite = <T>(ext: string, route: string, value: T) => {
  store.set(`${ext}::${route}`, value);
};

export const getFavorite = <T>(ext: string, route: string): T | undefined => {
  if (store.has(`${ext}::${route}`)) return store.get(`${ext}::${route}`) as T;
  return undefined;
};

export const hasFavorite = (ext: string, route: string): boolean => {
  return store.has(`${ext}::${route}`);
};

export const removeFavorite = (ext: string, route: string): void => {
  if (!hasFavorite(ext, route)) return;
  store.delete(`${ext}::${route}`);
};

export const getExtFavs = (ext: string) => {
  const res: string[] = [];
  const keys = Object.keys(store.store);
  for (const key of keys) {
    if (key.startsWith(`${ext}::`)) {
      const s = key.substring(`${ext}::`.length, key.length);
      res.push(s);
    } else {
      res.push("");
    }
  }
  return res;
};

export const getAllFavs = () => {
  const res: any[] = [];
  const keys = Object.keys(store.store);
  for (const key of keys) {
    const i = key.indexOf(":");
    if (i !== -1 && key[i + 1] === ":") {
      const s = key.substring(i + 2, key.length);
      res.push({ route: s, data: store.store[key], ext: key.substring(0, i) });
    }
  }

  return res;
};
