import { Home, GetContent, Parser, PageBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const { innerHTML } = await content(
      "https://www.mangago.me/list/new/all/1/"
    );
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $("body #page .left #search_list li").each((_i, el) => {
      const img = $(el).find(".left a img").attr("src")?.trim() || "";
      const base_ = $(el).find(".left .row-1 span.tit h2 a");
      const title = base_.text().trim();
      const route = base_.attr("href")?.trim().split(".me/")[1] || "";
      popular.push({
        title,
        img,
        type: "Manga",
        route: encodeRoute(route),
      });
    });
    return {
      popular,
    };
  };
};
