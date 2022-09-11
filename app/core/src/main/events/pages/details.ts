import fs from "fs";
import { downloadChapter } from "../../helper";
import { EventStack } from "../../handler";
import { getHash } from "workers";
import { join } from "path";
import {
  getCache,
  setCache,
  hasCache,
  getAllFavs,
  getFavorite,
  setDownload,
  hasFavorite,
  setFavorite,
  removeFavorite,
  setCurrentSource,
  getCurrentSources,
  getAllExtDownloads,
  getAllReadPercentage,
} from "../../store";

const events = new EventStack();

events.push(
  "get:details",
  async (
    { extensionID, extension, chromiumExec, internet },
    e,
    { route, ext }
  ) => {
    try {
      if (ext) {
        e.reply("res:details", {
          res: getFavorite(ext, route),
          fav: true,
        });
        return;
      }
      const key = "details" + route;
      if (hasFavorite(extensionID, route)) {
        e.reply("res:details", {
          res: getFavorite(extensionID, route),
          fav: true,
        });
      } else if (hasCache(extensionID, key)) {
        e.reply("res:details", {
          res: getCache(extensionID, key),
          fav: false,
        });
      } else {
        if (!internet) {
          e.reply("res:details", { res: null, fav: false });
          return;
        }
        const res = await extension?.details(route, chromiumExec);
        setCache(extensionID, key, res);
        e.reply("res:details", { res, fav: false });
      }
    } catch (error: any) {
      e.reply("res:error", { msg: error.message });
    }
  }
);

events.push("set:favorite", ({ extensionID }, e, { route, data }) => {
  if (hasFavorite(extensionID, route)) return;
  setFavorite(extensionID, route, data);
  e.reply("res:favorite", true);
});

events.push("remove:favorite", ({ extensionID }, e, { route, ext }) => {
  const _ext = ext || extensionID;
  removeFavorite(_ext, route);
  e.reply("res:favorite", false);
});

events.push("get:favorites", (_, e) => {
  const res = getAllFavs();
  e.reply("res:favorites", res);
});

events.push(
  "set:current:chapter:source",
  ({ extensionID }, e, { ext, route, chapter, current }) => {
    setCurrentSource(ext || extensionID, route, chapter, current);
    const res = getCurrentSources(ext || extensionID, route);
    e.reply("res:current:chapters:sources", res);
  }
);

events.push(
  "get:current:chapters:sources",
  ({ extensionID }, e, { ext, route }) => {
    const res = getCurrentSources(ext || extensionID, route);
    e.reply("res:current:chapters:sources", res);
  }
);

events.push("get:downloaded", ({ extensionID }, e, { ext }) => {
  const res = getAllExtDownloads(ext || extensionID);
  e.reply("res:downloaded", res);
});

events.push("get:read:percentage", ({ extensionID }, e, { ext, route }) => {
  e.reply(
    "res:read:percentage",
    getAllReadPercentage(ext || extensionID, route)
  );
});

events.push(
  "download",
  async (h, e, { rid, root, id, imgs, title, info, pages, ext }) => {
    if (!h.internet) {
      e.reply("res:error", { error: "No interner connection" });
      return;
    }
    const _rid = (rid as string).includes("=") ? await getHash(rid) : rid;
    const main = join(
      h.downloadFolder,
      h.extensionID,
      `${await getHash(root)}`
    );
    const base = join(main, `${_rid}`);
    if (!fs.existsSync(main)) fs.mkdirSync(main, { recursive: true });
    if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    const source = ext || h.extensionID;
    setDownload(rid, source, {
      data: { title, info, pages, id, rid: rid },
      done: false,
      inProgress: true,
    });
    e.reply("res:downloaded", getAllExtDownloads(source));
    e.reply("downloading:chapter", {
      rid,
      inf: title + " | " + info,
    });

    if (h.currentDowns < h.maxDownloads) {
      h.currentDowns++;
      try {
        const headers_ = h.extension?.opts?.headers;
        const refererRule = h.extension?.opts?.refererRule;
        const headers = refererRule
          ? { ...headers_, referer: refererRule(imgs[0].url) }
          : headers_;
        if (headers && headers.Referer) {
          delete headers.Referer;
        }
        await downloadChapter(h.chromiumExec, base, `${id}_`, imgs, headers);
        e.reply("downloading:chapter:done", {
          rid,
        });
        setDownload(rid, source, {
          data: { title, info, pages, id, rid: rid },
          done: true,
          inProgress: false,
        });
        h.currentDowns--;
        e.reply("download:done", rid);
        e.reply("res:downloaded", getAllExtDownloads(source));
      } catch (error: any) {
        h.currentDowns--;
        e.reply("download:done", rid);
        e.reply("res:error", { error: error.message });
      }
    } else {
      e.reply("download:done", rid);
      e.reply("res:error", { error: "Download limit reached" });
    }
  }
);

export default events;
