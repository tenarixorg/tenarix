import { Home, GetContent, Parser, HomeBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const { innerHTML } = await content(
      "https://lectormanga.com/library?title=&order_field=title&order_item=likes_count&order_dir=desc&type=&demography=&webcomic=&yonkoma=&amateur=&erotic="
    );
    const $ = parser(innerHTML);

    const popular: HomeBase[] = [];

    $("#app .container .row .col-12 .card").each((_i, el) => {
      const title = $(el).find(".card-header a").text().trim();
      const route =
        $(el)
          .find(".card-header a")
          .attr("href")
          ?.trim()
          .split("/library/")[1] || "";
      const img = $(el).find(".card-body img").attr("src")?.trim() || "";
      const score = $(el)
        .find(".card-footer span.float-left small")
        .text()
        .trim();
      const type = $(el).find(".card-footer span.float-right").text().trim();
      popular.push({
        title,
        route: encodeRoute(route),
        img,
        score,
        type,
        demography: "",
      });
    });

    return {
      popular,
    };
  };
};
