import assert from "assert";
import { downloadItem, extractLocalFiles, getContent } from "../helper";
import { getChromiumPath, setChromiumPath } from "../store";
import { EventStack } from "../handler";
import { resolve } from "path";

const events = new EventStack();

events.push(
  "get:chromium",
  async ({ files, chromium, win, internet }, event) => {
    if (getChromiumPath()) return;
    if (!internet) {
      win.webContents.send("error", {
        error: "No internet connection",
      });
      return;
    }
    win.webContents.send("res:chromium:stage", 1);
    const path = resolve(files.appFolder + "/chromium.zip");
    await downloadItem(
      win,
      chromium.meta.url,
      path,
      async (_, __, webContents) => {
        webContents.send("res:chromium:stage", 2);
        await extractLocalFiles(path, files.appFolder);
        setChromiumPath(chromium.exec);
        webContents.send("res:chromium:stage", 3);
        const url = "https://example.com/";
        try {
          const { current_url, innerHTML } = await getContent(
            url,
            getChromiumPath() || ""
          );
          assert.strictEqual(current_url, url);
          assert.ok(innerHTML.length > 1);
          webContents.send("res:chromium:stage", 4);
          event.reply("res:navigate", true);
        } catch (e: any) {
          event.reply("res:error", { error: e.message });
        }
      },
      (_, state, webContents, item) => {
        if (state === "progressing") {
          const progress =
            (item.getReceivedBytes() / item.getTotalBytes()) * 100;
          webContents.send("res:chromium:down:progress", progress);
        }
      }
    );
  }
);

events.push("restore:size", ({ win }) => {
  win.setResizable(true);
  win.setSize(950, 540);
  win.setMinimumSize(950, 540);
});

events.push("can:navigate", async (h, e) => {
  const path = getChromiumPath();
  if (path) {
    h.chromium.exec = path;
    e.reply("res:navigate", true);
  } else {
    e.reply("res:navigate", false);
  }
});

export default events;
