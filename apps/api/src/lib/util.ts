import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const content = async (url: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() !== "document") {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.goto(url);
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
  return innerHTML;
};

export const getImg = async (url: string) => {
  const browser = await puppeteer.launch();
  const page_ = await browser.newPage();

  await page_.setRequestInterception(true);
  page_.on("request", (req) => {
    if (req.resourceType() !== "document" && req.resourceType() !== "image") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page_.goto(url);
  try {
    await page_.waitForSelector("img", { timeout: 30000 });
  } catch (e) {
    await page_.waitForSelector("img", { timeout: 30000 });
  }
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

export const encodeRoute = (data: string) => {
  return data.replace(/\//g, "=");
};

export const decodeRoute = (enco: string) => {
  return enco.replace(/=/g, "/");
};
