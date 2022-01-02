import { HomeBase, Home, GetContent, Parser } from "types";
import { encodeRoute } from "./util";

export const _home =
  (content: GetContent, parser: Parser) => async (): Promise<Home> => {
    const { innerHTML } = await content("https://heavenmanga.com");
    const $ = parser(innerHTML);
    const popular: HomeBase[] = [];
    $(
      ".container .row .col-md-12 .page-content-listing .page-listing-item .row .col-xs-12 .page-item-detail .photo"
    ).each((_, e) => {
      const route = $(e).find("a").attr("href")?.trim().split(".com/")[1] || "";
      const title = $(e).find(".manga-name").text().trim();
      const img = $(e).find("a img").attr("src") || "";
      const score = $(e).find(".score").text().trim();
      const type = $(e).find(".book-type").text().trim();
      const demography = "";
      popular.push({
        img,
        title,
        score,
        type,
        demography,
        route: encodeRoute(route),
      });
    });
    return {
      popular,
    };
  };
