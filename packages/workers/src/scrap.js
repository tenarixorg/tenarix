/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50";

puppeteer.use(StealthPlugin());

const getChromiumExecPath = () => {
  return puppeteer.executablePath().replace("app.asar", "app.asar.unpacked");
};

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
  const img = await page_.screenshot({
    encoding: "binary",
    clip: { x: x || 0, y: y || 0, width: w || 0, height: h || 0 },
    type: "jpeg",
    quality: 100,
  });
  await browser.close();
  return img;
};

module.exports = {
  getImg,
};
