import assert from "assert";
import { downloadItem, extractLocalFiles, getContent } from "../helper";
import { getChromiumPath, setChromiumPath } from "../store";
import { EventStack } from "../handler";
import { resolve } from "path";
import { dialog } from "electron";

const events = new EventStack();

events.push(
  "get:chromium",
  async ({ appFolder, chromium, chromiumExec, win }) => {
    const path = resolve(appFolder + "/chromium.zip");
    await downloadItem(
      win,
      chromium.url,
      path,
      async (_, __, webContents) => {
        await extractLocalFiles(path, appFolder);
        setChromiumPath(chromiumExec);
        webContents.send("res:navigate", true);
      },
      (_, state, webContents, item) => {
        if (state === "progressing") {
          webContents.send("res:error", {
            error: (item.getReceivedBytes() / item.getTotalBytes()) * 100,
          });
        }
      }
    );
  }
);

events.push("use:installed:browser", async (h, e) => {
  const f = dialog.showOpenDialogSync(h.win) || [""];
  if (f[0] !== "") {
    const url = "https://example.com/";
    h.chromiumExec = f[0];
    try {
      const { current_url, innerHTML } = await getContent(url, h.chromiumExec);
      assert.strictEqual(current_url, url);
      assert.ok(innerHTML.length > 1);
      setChromiumPath(h.chromiumExec);
      e.reply("res:navigate", true);
    } catch (error) {
      e.reply("res:navigate", false);
      e.reply("res:error", { error: "Invalid Browser" });
    }
  } else {
    e.reply("res:navigate", false);
    e.reply("res:error", { error: "Invalid Browser" });
  }
});

events.push("can:navigate", async (h, e) => {
  const path = getChromiumPath();

  if (path) {
    h.chromiumExec = path;
    e.reply("res:navigate", true);
  } else {
    e.reply("res:navigate", false);
  }
});

export default events;
