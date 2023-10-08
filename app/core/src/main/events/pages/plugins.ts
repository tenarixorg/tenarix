import fs from "fs";
import { downloadItem, extractLocalFiles } from "../../helper";
import { getAllExtensions } from "utils";
import { EventStack } from "../../handler";
import { resolve } from "path";
import {
  removePinExt,
  removeExtCache,
  removeAllExtFavorites,
  removeAllExtDownloads,
  removeAllExtReadPercentage,
} from "../../store";

const events = new EventStack();

events.push("get:plugins", async (_, e) => {
  try {
    const plugins = await getAllExtensions(
      "http://localhost:4000/api/v1/extension/all"
    );
    e.reply("res:plugins", plugins);
  } catch (error: any) {
    e.reply("res:error", { error: error.message });
  }
});

events.push(
  "get:installed:plugins",
  async ({ files: { extensionsFolder } }, e) => {
    try {
      const plugins = fs.readdirSync(extensionsFolder);
      e.reply("res:installed:plugins", plugins);
    } catch (error: any) {
      e.reply("res:error", { error: error.message });
    }
  }
);

events.push(
  "install:plugin",
  async (
    { win, files, extensionNameMap },
    _,
    { tarball, uninstall, clear }
  ) => {
    const name = tarball.split("/").pop();
    const uname = name.split("_")[0];
    const rname = extensionNameMap[uname];
    if (uninstall) {
      const path = resolve(files.extensionsFolder, uname);
      const downs = resolve(files.downloadFolder, rname);
      fs.rmSync(path, { recursive: true });
      removeAllExtFavorites(rname);
      removePinExt(rname);
      if (clear) {
        if (fs.existsSync(downs)) fs.rmSync(downs, { recursive: true });
        removeAllExtDownloads(rname);
        removeAllExtReadPercentage(rname);
        removeExtCache(rname);
      }
      return;
    }
    const path = resolve(files.extensionsFolder + "/" + name);
    await downloadItem(win, tarball, path, async () => {
      await extractLocalFiles(path, files.extensionsFolder, true);
    });
  }
);

export default events;
