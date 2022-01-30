import { GetContent, Parser, Read } from "types";
import { decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    const baseUrl = "https://r1.leermanga.xyz";
    const url = baseUrl + decodeRoute(id);
    const { innerHTML, current_url } = await content(url, {
      scripts: true,
      action: async (page) => {
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
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
    const base = $(".container .row .col-md-8 .container h1").text().trim();
    const title = base.split(" - ")[0];
    const info = base.split(" - ")[1];
    const id_ = current_url.split("/chapters")[0].split("/").reverse()[0];
    const imgs = $(".container .row .col-md-8 .container .panel img");
    const urls: Read["imgs"] = [];
    imgs.each((i, el) => {
      const url_ =
        $(el)
          .attr("src")
          ?.replace(/preview/g, "full") || "";
      urls.push({ url: url_, page: i + 1 });
    });
    const pages = imgs.length;
    return {
      id: id_,
      title,
      info,
      pages,
      imgs: urls,
    };
  };
};
