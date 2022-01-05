import { Home, GetContent, Parser, HomeBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const baseUrl = "https://inmanga.com";
    const { innerHTML } = await content(baseUrl + "/manga/consult", {
      scripts: true,
      action: async (page) => {
        await page.waitForSelector("a.manga-result");
      },
    });
    const $ = parser(innerHTML);
    const popular: HomeBase[] = [];
    $("#MangaConsultResult a.manga-result").each((_, el) => {
      const route = $(el).attr("href")?.trim() || "";
      const title = $(el).find(".list-group h4.ellipsed-text").text().trim();
      const img = baseUrl + "/thumbnails" + route.substring(4, route.length);
      const type = $(el)
        .find(".font-size-13 .list-group-item h4.mb0 span.label.pull-right")
        .text()
        .trim()
        .split("/")[0];
      popular.push({
        route: encodeRoute(route),
        img,
        title,
        score: "",
        type: type.substring(0, type.length - 2),
        demography: "",
      });
    });
    return {
      popular,
    };
  };
};
