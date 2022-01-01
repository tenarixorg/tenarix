import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const getChromiumExecPath = () => {
  return puppeteer.executablePath().replace("app.asar", "app.asar.unpacked");
};

export const content = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: getChromiumExecPath(),
  });
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
  const current_url = page.url();
  return { innerHTML, current_url };
};

export const encodeRoute = (data: string) => {
  return data.replace(/\//g, "=");
};

export const decodeRoute = (enco: string) => {
  return enco.replace(/=/g, "/");
};
