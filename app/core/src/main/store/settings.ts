import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";
import { SettingsStore } from "types";

const store = new Store<Record<string, SettingsStore>>({
  cwd: resolve(app.getPath("home") + "/.tenarix"),
  name: "settings",
});

export const setSettings = (value: SettingsStore) => {
  store.set("user", value);
};

export const getSettings = () => {
  if (store.has("user")) return store.get("user");
  return undefined;
};

export const hasSettings = (target: string): boolean => {
  return store.has(target);
};
