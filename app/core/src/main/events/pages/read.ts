import fs from "fs";
import { resolve, join } from "path";
import { loadChapter } from "../../helper";
import { EventStack } from "../../handler";
import { getHash } from "workers";
import {
  getCache,
  setCache,
  hasCache,
  hasDownload,
  getDownload,
  setReadPersentage,
  getReadPercentage,
  getAllReadPercentage,
} from "../../store";

const events = new EventStack();

events.push("get:read:init", async (h, e, { id, ext }) => {
  const key = "read" + id;
  const source = ext || h.extensionID;
  h.extension = h.extensions[source];
  try {
    if (hasDownload(id, source) && getDownload(id, source)?.done) {
      e.reply("res:read:init", getDownload(id, source)?.data);
    } else if (hasCache(source, key)) {
      e.reply("res:read:init", getCache(source, key));
    } else {
      const res = await h.extension.read(id, h.chromiumExec);
      setCache(source, key, res);
      e.reply("res:read:init", res);
    }
  } catch (error: any) {
    e.reply("res:error", { msg: error.message });
  }
});

events.push(
  "get:read:page",
  async ({ extensionID }, e, { img, page, total, ext, route, id }) => {
    const percentage = (page / total) * 100;
    const stored = getReadPercentage(ext || extensionID, route, id);
    if (!stored?.percentage || stored.percentage < percentage) {
      setReadPersentage(ext || extensionID, route, id, {
        percentage: (page / total) * 100,
        lastPage: page,
      });
    }
    e.reply("res:read:page", img);
  }
);

events.push(
  "get:read:local",
  async ({ extensionID, downloadFolder }, e, { rid, root, id, total, ext }) => {
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    if (getDownload(rid, ext || extensionID)?.inProgress) {
      e.reply("res:read:local", false);
      return;
    }
    const main = join(downloadFolder, await getHash(root));
    if (!fs.existsSync(resolve(main))) {
      e.reply("res:read:local", false);
      return;
    }
    const base = join(main, _rid);
    if (!fs.existsSync(resolve(base))) {
      e.reply("res:read:local", false);
      return;
    }
    try {
      const res = await loadChapter(base, `${id}_`, total);
      e.reply("res:read:local", res);
    } catch (error: any) {
      e.reply("res:read:local", false);
      e.reply("res:error", { error: error.message });
    }
  }
);

events.push(
  "set:read:percentage",
  ({ extensionID }, e, { ext, route, id, percentage, page, check }) => {
    if (check) {
      const stored =
        getReadPercentage(ext || extensionID, route, id)?.percentage || -1;
      if (stored !== -1)
        setReadPersentage(ext || extensionID, route, id, {
          percentage,
          lastPage: page,
        });
    } else {
      setReadPersentage(ext || extensionID, route, id, {
        percentage,
        lastPage: page,
      });
    }
    e.reply(
      "res:read:percentage",
      getAllReadPercentage(ext || extensionID, route)
    );
  }
);

events.push(
  "get:read:percentage:page",
  ({ extensionID }, e, { route, ext, id }) => {
    const lastPage =
      getReadPercentage(ext || extensionID, route, id)?.lastPage || 1;
    e.reply("res:read:percentage:page", lastPage);
  }
);

export default events;
