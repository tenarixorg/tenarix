/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { load } = require("cheerio");
const axios = require("axios");
axios.default.defaults.adapter = require("axios/lib/adapters/http");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50";

puppeteer.use(StealthPlugin());

/**
 * @param {string} url
 * @param {string} execPath
 * @param {{action?: (page: import("puppeteer").Page) => Promise<void>;scripts?: boolean;imgs?: boolean;headers?: Record<string, string>;}} opts
 * @returns {Promise<{innerHTML:string, current_url:string}>}
 */
const content = async (url, execPath, opts) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  });
  const [page] = await browser.pages();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "document") {
      return req.continue();
    } else if (
      (req.resourceType() === "script" ||
        req.resourceType() === "xhr" ||
        req.resourceType() === "image") &&
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
 * @param {string} execPath
 * @param {Record<string,string>} headers
 * @returns {Promise<Buffer>}
 */
const getImg = async (url, execPath, headers) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
  });
  const page_ = await browser.newPage();
  await page_.setUserAgent(UA);
  await page_.setExtraHTTPHeaders(headers || {});
  let img;
  page_.on("response", async (response) => {
    const data = await response.buffer();
    img = data;
  });
  await page_.goto(url, { waitUntil: "networkidle2" });
  await browser.close();
  return img;
};

module.exports = {
  getImg,
  content,
  parser: load,
  http: axios,
};
