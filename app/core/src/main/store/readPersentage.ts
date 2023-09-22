import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";
import { ReadPercentage, ReadPercentageStore } from "types";

const store = new Store<Record<string, ReadPercentageStore>>({
  cwd: resolve(app.getPath("home") + "/.tenarix"),
  name: "read_percentage",
});

export const setReadPersentage = (
  ext: string,
  route: string,
  id: string,
  value: ReadPercentageStore
) => {
  store.set(`${ext}::${route}::${id}`, value);
};

export const getReadPercentage = (ext: string, route: string, id: string) => {
  if (hasReadPercentage(ext, route, id))
    return store.get(`${ext}::${route}::${id}`);
  return undefined;
};

export const hasReadPercentage = (
  ext: string,
  route: string,
  id: string
): boolean => {
  return store.has(`${ext}::${route}::${id}`);
};

export const getAllReadPercentage = (ext: string, route: string) => {
  const res: ReadPercentage[] = [];
  const keys = Object.keys(store.store);
  for (const key of keys) {
    if (key.startsWith(`${ext}::${route}`)) {
      res.push({
        id: key.split("::")[2],
        percetage: store.store[key].percentage,
      });
    }
  }
  return res;
};

export const removeAllExtReadPercentage = (ext: string): void => {
  const keys = store.store;
  for (const key in keys) {
    if (key.includes(ext)) store.delete(key);
  }
};
