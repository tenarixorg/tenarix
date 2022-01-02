import { Filters, GetContent, LibItem, Library, Parser } from "types";
import { encodeRoute } from "./util";

const libraryParams = (query: string) => {
  return `https://heavenmanga.com/buscar?query=${query}`;
};

export const _library = (content: GetContent, parser: Parser) => {
  return async (_page: string, filters?: Filters): Promise<Library> => {
    const { innerHTML } = await content(libraryParams(filters?.title || ""));
    const $ = parser(innerHTML);
    const items: LibItem[] = [];
    $(".c-tabs-item__content").each((_, e) => {
      const title = $(e).find(".post-title h4 a").text().trim();
      const base = $(e).find(".c-tabs-item__content .col-sm-2 .tab-thumb a");
      const img = base.find("img").attr("src")?.trim() || "";
      const route = base.attr("href")?.trim().split(".com/")[1] || "";
      items.push({
        img,
        title,
        score: "",
        type: "",
        demography: "",
        route: encodeRoute(route),
      });
    });
    return {
      items,
    };
  };
};
