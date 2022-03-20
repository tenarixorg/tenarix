import { PageBase, Home, GetContent, Parser } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (execPath: string): Promise<Home> => {
    const { innerHTML } = await content("https://heavenmanga.com", execPath);
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $(
      ".container .row .col-md-12 .page-content-listing .page-listing-item .row .col-xs-12 .page-item-detail .photo"
    ).each((_, e) => {
      const route = $(e).find("a").attr("href")?.trim().split(".com/")[1] || "";
      const title = $(e).find(".manga-name").text().trim();
      const img = $(e).find("a img").attr("src") || "";
      const type = $(e).find(".book-type").text().trim();
      popular.push({
        img,
        title,
        type,
        route: encodeRoute(route),
      });
    });
    return {
      popular,
    };
  };
};
