import { Filters, GetContent, LibItem, Library, Parser } from "types";
import { encodeRoute } from "utils";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://lectormanga.com/library?title=${
    filters?.title || ""
  }&order_item=likes_count&order_dir=desc&page=${page || 1}`;
};

export const _library = (content: GetContent, parser: Parser) => {
  return async (page: string, filters?: Filters): Promise<Library> => {
    const { innerHTML } = await content(libraryParams(page, filters));
    const $ = parser(innerHTML);
    const items: LibItem[] = [];

    $("#app .container .row div.col-12.col-lg-8 .card").each((_i, el) => {
      const title = $(el).find(".card-header a").text().trim();
      const route =
        $(el)
          .find(".card-header a")
          .attr("href")
          ?.trim()
          .split("/library/")[1] || "";
      const img = $(el).find(".card-body img").attr("src")?.trim() || "";
      const score = $(el)
        .find(".card-footer span.float-left small")
        .text()
        .trim();
      const type = $(el).find(".card-footer span.float-right").text().trim();

      items.push({
        title,
        route: encodeRoute(route),
        img,
        score,
        type,
        demography: "",
      });
    });

    return {
      items,
    };
  };
};
