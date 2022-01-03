import { HomeBase, Home, GetContent, Parser } from "types";
import { encodeRoute } from "./util";

export const _home =
  (content: GetContent, parser: Parser) => async (): Promise<Home> => {
    const { innerHTML } = await content("https://lectortmo.com");
    const $ = parser(innerHTML);
    const popular: HomeBase[] = [];
    $("main #pills-populars .element a").each((_, e) => {
      const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
      const title = $(e).find(".thumbnail-title h4").text().trim();
      const img = ($(e).find("style").html() as string)
        .split("('")[1]
        .split("')")[0]
        .trim();
      const score = $(e).find(".score").text().trim();
      const type = $(e).find(".book-type").text().trim();
      const demography = $(e).find(".demography").text().trim();
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
