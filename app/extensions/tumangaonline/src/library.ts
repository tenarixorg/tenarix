import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://lectortmo.com/library?order_item=likes_count&order_dir=desc&title=${
    filters?.title || ""
  }&_pg=1&filter_by=${"title"}&type=${""}&demography=${""}&status=${""}&translation_status=${""}&webcomic=${""}&yonkoma=${""}&amateur=${""}&erotic=${""}&_pg=1&page=${
    page || 1
  }`;
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
    $("main .row .element a").each((_, e) => {
      const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
      const title = $(e).find(".thumbnail-title h4").text().trim();
      const img = ($(e).find("style").html() as string)
        .split("('")[1]
        .split("')")[0]
        .trim();
      const type = $(e).find(".book-type").text().trim();
      items.push({
        img,
        title,
        type,
        route: encodeRoute(route),
      });
    });
    return {
      items,
    };
  };
};
