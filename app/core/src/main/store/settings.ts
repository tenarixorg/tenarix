import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";
import { SettingsStore } from "types";

const store = new Store<Record<string, SettingsStore>>({
  cwd: resolve(app.getPath("home") + "/.tenarix/config"),
  name: "settings",
});

export const setSettings = (value: SettingsStore) => {
  store.set("app", value);
};

export const getSettings = () => {
  if (store.has("app")) return store.get("app");
  return undefined;
};

export const hasSettings = (target: string): boolean => {
  return store.has(target);
};
