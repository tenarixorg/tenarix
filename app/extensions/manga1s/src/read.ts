import { GetContent, Parser, Read } from "types";
import { decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    const url = "https://manga1s.com" + decodeRoute(id);
    const { innerHTML } = await content(url, {
      scripts: true,
      action: async (page) => {
        await page.waitForTimeout(6000);
      },
    });
    const $ = parser(innerHTML);
    const imgs: Read["imgs"] = [];
    const base = $(
      ".container-fluid .row .container .row .col-12:nth-of-type(3) .chapter-content"
    );
    const title = base.find(".chapter-header .chapter-title h4").text().trim();
    const info = base.find(".chapter-header .chapter-title h5").text().trim();
    base.find(".chapter-detail .chapter-images img").each((i, el) => {
      const url = $(el).attr("data-src")?.trim() || "";
      imgs.push({
        page: i + 1,
        url,
      });
    });
    const pages = imgs.length;
    const id_ = imgs[0].url.split("/").reverse()[0].split(".")[0];
    return {
      id: id_,
      title,
      info,
      pages,
      imgs,
    };
  };
};
