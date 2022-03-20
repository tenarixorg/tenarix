import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://lectormanga.com/library?title=${
    filters?.title || ""
  }&order_item=likes_count&order_dir=desc&page=${page || 1}`;
};

export const _library = (content: GetContent, parser: Parser) => {
  return async (
    page: string,
    execPath: string,
    filters?: Filters
  ): Promise<Library> => {
    const { innerHTML } = await content(libraryParams(page, filters), execPath);
    const $ = parser(innerHTML);
    const items: PageBase[] = [];
    $("#app .container .row div.col-12.col-lg-8 .card").each((_i, el) => {
      const title = $(el).find(".card-header a").text().trim();
      const route =
        $(el)
          .find(".card-header a")
          .attr("href")
          ?.trim()
          .split("/library/")[1] || "";
      const img = $(el).find(".card-body img").attr("src")?.trim() || "";
      const type = $(el).find(".card-footer span.float-right").text().trim();
      items.push({
        title,
        route: encodeRoute(route),
        img,
        type,
      });
    });
    return {
      items,
    };
  };
};
