import { contextBridge, ipcRenderer } from "electron";
import { domReady } from "./utils";

(async () => {
  await domReady();
})();

contextBridge.exposeInMainWorld("bridge", {
  api: withPrototype(ipcRenderer),
});

function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === "function") {
      obj[key] = function (...args: any) {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
