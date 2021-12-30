import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { details, home, library, read, getImg, decodeRoute } from "../lib";
import { Request, Response } from "express";
import { createClient } from "redis";
import { Readable } from "stream";

puppeteer.use(StealthPlugin());
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
})();

export const getHome = async (_req: Request, res: Response) => {
  const home_redis = await client.get("home");

  if (home_redis) {
    return res.json({
      result: JSON.parse(home_redis),
    });
  }

  const result = await home();
  await client.set("home", JSON.stringify(result), {
    EX: 60 * 60 * 6,
    NX: true,
  });

  return res.json({
    result,
  });
};

export const getLibrary = async (req: Request, res: Response) => {
  const { page } = req.params;
  const { filters } = req.body;

  const key =
    "library" + page + JSON.stringify(filters).replace(/({|}|,|"|:)/g, "");

  const library_redis = await client.get(key);

  if (library_redis) {
    return res.json({
      result: JSON.parse(library_redis),
    });
  }
  const result = await library(page, filters);

  await client.set(key, JSON.stringify(result.items));

  return res.json({
    result: result.items,
  });
};

export const getDetails = async (req: Request, res: Response) => {
  const { route } = req.params;

  const key = "details" + route;

  const details_redis = await client.get(key);

  if (details_redis) {
    return res.json({
      result: JSON.parse(details_redis),
    });
  }

  const result = await details(
    `https://lectortmo.com/library/${decodeRoute(route)}`
  );

  await client.set(key, JSON.stringify(result));

  return res.json({
    result,
  });
};

export const getRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  const key = "read" + id;

  const read_redis = await client.get(key);

  if (read_redis) {
    return res.json({
      result: JSON.parse(read_redis),
    });
  }

  const result = await read(`https://lectortmo.com/view_uploads/${id}`);
  await client.set(key, JSON.stringify(result));
  return res.json({
    result,
  });
};

export const getPage = async (req: Request, res: Response) => {
  const { id, page } = req.params;

  const key = "page" + id + page;

  const page_redis = await client.get(key);

  if (page_redis) {
    const buff = Buffer.from(page_redis, "base64");
    res.end(buff);
  } else {
    const url = `https://lectortmo.com/viewer/${id}/paginated/${page}`;

    const img = await getImg(url);

    await client.set(key, Buffer.from(img).toString("base64"));

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": img.length,
    });

    const stream = Readable.from(img);

    stream.pipe(res);
  }
};
