import { Home, GetContent, Parser, PageBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const { innerHTML } = await content("https://manga1s.com/search?q=", {
      scripts: true,
      action: async (page) => {
        await page.waitForTimeout(6000);
      },
    });
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $(
      ".container-fluid .row .container .row .novel-grid .row:nth-of-type(2) .novel-item .novel-wrap"
    ).each((_i, el) => {
      const base = $(el).find(".novel-detail-wrap .novel-name h2 a");
      const title = base.text().trim();
      const route = base.attr("href")?.trim() || "";
      const img =
        $(el).find(".novel-thumbnail-image a img").attr("data-src") || "";
      popular.push({
        img,
        title,
        type: "Manga",
        route: encodeRoute(route),
      });
    });
    return {
      popular,
    };
  };
};
