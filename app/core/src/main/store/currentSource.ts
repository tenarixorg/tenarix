import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";

const store = new Store({
  cwd: resolve(app.getPath("home") + "/.tenarix"),
  name: "current_source",
});

export const setCurrentSource = (
  ext: string,
  route: string,
  chapter: string,
  value: string
) => {
  store.set(`${ext}::${route}::${chapter.replace(/\./g, "_")}`, value);
};

export const getCurrentSources = (ext: string, route: string) => {
  const res: { chapter: string; id: string }[] = [];
  const keys = Object.keys(store.store);
  for (const key of keys) {
    if (key.includes(`${ext}::${route}`)) {
      const chapter = key.split("::")[2];
      const id = store.store[key] as string;
      res.push({ chapter: chapter.replace(/_/g, "."), id });
    }
  }
  return res;
};

export const hasCurrentSource = (
  ext: string,
  route: string,
  chapter: string
): boolean => {
  return store.has(`${ext}::${route}::${chapter}`);
};
