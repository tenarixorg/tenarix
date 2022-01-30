import { GetContent, Parser, Read } from "types";
import { decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    console.log(id);

    const url = "https://zahard.xyz/" + decodeRoute(id);
    const { innerHTML } = await content(url, {
      scripts: true,
      action: async (page) => {
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve(true);
              }
            }, 100);
          });
        });
      },
    });
    const $ = parser(innerHTML);
    const imgs: Read["imgs"] = [];
    const base1 = $("body .readerMsj .container");
    $("body .container-fluid .viewer-cnt .row .col-xs-12 #all img").each(
      (i, el) => {
        const url = $(el).attr("src")?.trim() || "";
        imgs.push({
          page: i + 1,
          url,
          free: true,
        });
      }
    );
    const title = base1.find("h1").text().trim();
    const info = base1.find("h2").text().trim();
    const pages = imgs.length;
    const temp = imgs[0].url.split("/").reverse();
    const id_ = temp[1] + temp[0].split(".")[0];
    return {
      id: id_,
      title,
      info,
      pages,
      imgs,
    };
  };
};
