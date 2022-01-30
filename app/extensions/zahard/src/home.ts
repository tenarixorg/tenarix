import { Home, GetContent, Parser, HomeBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const { innerHTML } = await content("https://zahard.xyz/manga-list");
    const $ = parser(innerHTML);
    const popular: HomeBase[] = [];
    $(
      "body .container-fluid .row:nth-child(3) .col-sm-8 .col-sm-12 .type-content .row .content .media"
    ).each((_i, el) => {
      const base = $(el).find(".media-body h5.media-heading a.chart-title");
      const img = $(el).find(".media-left a img").attr("src")?.trim() || "";
      const title = base.text().trim();
      const route = base.attr("href")?.trim().split(".xyz/")[1] || "";
      popular.push({
        img,
        title,
        route: encodeRoute(route),
        type: "Manga",
        score: "",
        demography: "",
      });
    });

    return {
      popular,
    };
  };
};
