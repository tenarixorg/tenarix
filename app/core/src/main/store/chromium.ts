import Store from "electron-store";
import { app } from "electron";
import { resolve } from "path";

const store = new Store<Record<string, string>>({
  cwd: resolve(app.getPath("home") + "/.tenarix/config"),
  name: "chromium",
});

export const setChromiumPath = (value: string) => {
  store.set("path", value);
};

export const getChromiumPath = () => {
  if (store.has("path")) return store.get("path");
  return undefined;
};
