import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://r1.leermanga.xyz/search?query=${filters?.title || ""}&page=${
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
    $(".container .row .col-md-8 .container .card").each((_i, el) => {
      const title = $(el).find(".row .col-8 h2").text().trim();
      const img = $(el).find(".row .col-4 a img").attr("src")?.trim() || "";
      const route = $(el).find(".row .col-4 a").attr("href")?.trim() || "";
      items.push({
        title,
        img,
        route: encodeRoute(route),
        type: "Manga",
      });
    });
    return {
      items,
    };
  };
};
