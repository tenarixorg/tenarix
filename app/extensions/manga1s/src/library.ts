import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://manga1s.com/search?q=${filters?.title || ""}&p=${page}`;
};

export const _library = (content: GetContent, parser: Parser) => {
  return async (page: string, filters?: Filters): Promise<Library> => {
    const { innerHTML } = await content(libraryParams(page, filters), {
      scripts: true,
      action: async (page) => {
        await page.waitForTimeout(6000);
      },
    });
    const $ = parser(innerHTML);
    const items: PageBase[] = [];
    $(
      ".container-fluid .row .container .row .novel-grid .row:nth-of-type(2) .novel-item .novel-wrap"
    ).each((_i, el) => {
      const base = $(el).find(".novel-detail-wrap .novel-name h2 a");
      const title = base.text().trim();
      const route = base.attr("href")?.trim() || "";
      const img =
        $(el).find(".novel-thumbnail-image a img").attr("data-src") || "";
      items.push({
        img,
        title,
        type: "Manga",
        route: encodeRoute(route),
      });
    });
    return {
      items,
    };
  };
};
