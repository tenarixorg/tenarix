import { Home, GetContent, Parser, PageBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (execPath: string): Promise<Home> => {
    const { innerHTML } = await content(
      "https://r1.leermanga.xyz/list?page=1",
      execPath
    );
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $(".container .row .col-md-8 .container .card").each((_i, el) => {
      const title = $(el).find(".row .col-8 h2").text().trim();
      const img = $(el).find(".row .col-4 a img").attr("src")?.trim() || "";
      const route = $(el).find(".row .col-4 a").attr("href")?.trim() || "";
      popular.push({
        title,
        img,
        route: encodeRoute(route),
        type: "Manga",
      });
    });
    return {
      popular,
    };
  };
};
