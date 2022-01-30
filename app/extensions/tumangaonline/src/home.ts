import { PageBase, Home, GetContent, Parser } from "types";
import { encodeRoute } from "utils";

export const _home =
  (content: GetContent, parser: Parser) => async (): Promise<Home> => {
    const { innerHTML } = await content("https://lectortmo.com/populars");
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $("main .element a").each((_, e) => {
      const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
      const title = $(e).find(".thumbnail-title h4").text().trim();
      const img = ($(e).find("style").html() as string)
        .split("('")[1]
        .split("')")[0]
        .trim();
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
