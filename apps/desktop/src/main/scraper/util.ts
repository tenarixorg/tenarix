import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { load } from "cheerio";
import { Content, Opts } from "types";

puppeteer.use(StealthPlugin());

const getChromiumExecPath = () => {
  return puppeteer.executablePath().replace("app.asar", "app.asar.unpacked");
};

export const parser = load;

export const content = async (url: string, opts?: Opts): Promise<Content> => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: getChromiumExecPath(),
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "document") {
      req.continue();
    } else if (
      (req.resourceType() === "script" || req.resourceType() === "xhr") &&
      opts?.scripts
    ) {
      req.continue();
    } else {
      req.abort();
    }
  });
  await page.goto(url);
  if (opts?.action) {
    await opts.action(page);
  }
  const innerHTML = await page.evaluate(() => {
    const main = document.body;
    for (const form of main.querySelectorAll("form")) {
      form.remove();
    }
    for (const formr of main.querySelectorAll(".form-row")) {
      formr.remove();
    }
    for (const script of main.querySelectorAll("script")) {
      script.remove();
    }
    for (const iframe of main.querySelectorAll("iframe")) {
      iframe.remove();
    }
    return main.innerHTML;
  });
  await page.close();
  await browser.close();
  const current_url = page.url();
  return { innerHTML, current_url };
};

export const encodeRoute = (data: string) => {
  return data.replace(/\//g, "=");
};

export const decodeRoute = (enco: string) => {
  return enco.replace(/=/g, "/");
};
