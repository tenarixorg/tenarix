import { Filters, GetContent, Library, Parser, PageBase } from "types";
import { encodeRoute } from "utils";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://www.mangago.me/r/l_search/?name=${
    filters?.title || ""
  }&page=${page}`;
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
    $("body #page .left #search_list li").each((_i, el) => {
      const img = $(el).find(".left a img").attr("src")?.trim() || "";
      const base_ = $(el).find(".left .row-1 span.tit h2 a");
      const title = base_.text().trim();
      const route = base_.attr("href")?.trim().split(".me/")[1] || "";
      items.push({
        title,
        img,
        type: "Manga",
        route: encodeRoute(route),
      });
    });
    return {
      items,
    };
  };
};
