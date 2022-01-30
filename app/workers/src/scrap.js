/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { load } = require("cheerio");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50";

puppeteer.use(StealthPlugin());

const getChromiumExecPath = () => {
  return puppeteer.executablePath();
};

/**
 * @param {string} url
 * @param {{action?: (page: import("puppeteer").Page) => Promise<void>;scripts?: boolean;imgs?: boolean;headers?: Record<string, string>;}} opts
 * @returns {Promise<{innerHTML:string, current_url:string}>}
 */
const content = async (url, opts) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: getChromiumExecPath(),
    args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "document") {
      return req.continue();
    } else if (
      (req.resourceType() === "script" ||
        req.resourceType() === "xhr" ||
        (req.resourceType() === "image" && opts?.imgs)) &&
      opts?.scripts
    ) {
      /* istanbul ignore next */
      return req.continue();
    } else {
      /* istanbul ignore next */
      return req.abort();
    }
  });
  await page.setUserAgent(UA);
  await page.setExtraHTTPHeaders(opts?.headers || {});
  await page.goto(url, { waitUntil: "load", timeout: 0 });
  if (opts?.action) {
    await opts.action(page);
  }
  const innerHTML = await page.content();
  await page.close();
  await browser.close();
  page.removeAllListeners("request");
  const current_url = page.url();
  return { innerHTML, current_url };
};

/**
 *
 * @param {string} url
 * @param {Record<string,string>} headers
 * @returns {Promise<Buffer>}
 */
const getImg = async (url, headers) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: getChromiumExecPath(),
  });
  const page_ = await browser.newPage();
  await page_.setUserAgent(UA);
  await page_.setExtraHTTPHeaders(headers || {});
  await page_.setRequestInterception(true);
  /* istanbul ignore next */
  page_.on("request", (req) => {
    if (req.resourceType() !== "document" && req.resourceType() !== "image") {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page_.goto(url, { waitUntil: "networkidle2" });
  await page_.waitForSelector("img", { timeout: 30000 });
  await page_.setViewport({ height: 4320, width: 7680, deviceScaleFactor: 1 });
  const image = await page_.$("img");
  const box = await image?.boundingBox();
  const x = box?.x;
  const y = box?.y;
  const w = box?.width;
  const h = box?.height;
  let img;
  try {
    img = await page_.screenshot({
      encoding: "binary",
      clip: { x, y, width: w, height: h },
      type: "jpeg",
      quality: 100,
    });
  } catch (err) {
    /* istanbul ignore next */
    img = null;
  }
  await browser.close();
  return img;
};

module.exports = {
  getImg,
  content,
  parser: load,
};
