import Store from "electron-store";
import { app } from "electron";

const store = new Store({
  cwd: app.getPath("desktop"),
  name: "pinned_ext",
});

export const setPinExt = (ext: string) => {
  store.set(ext, true);
};

export const getPinExt = (ext: string) => {
  if (hasPinExt(ext)) return store.get(ext);
  return undefined;
};

export const hasPinExt = (ext: string): boolean => {
  return store.has(ext);
};

export const removePinExt = (ext: string): void => {
  if (!hasPinExt(ext)) return;
  store.delete(ext);
};
