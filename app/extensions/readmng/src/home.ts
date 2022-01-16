import { Home, GetContent, Parser, HomeBase } from "types";
import { encodeRoute } from "utils";

export const _home = (content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const { innerHTML } = await content("https://www.readmng.com/hot-manga");
    const $ = parser(innerHTML);
    const popular: HomeBase[] = [];

    $(".content .container .col-left .row .content-list .style-list .box").each(
      (_i, el) => {
        const title = $(el).find(".title h2 a").text().trim();
        const route =
          $(el).find(".title h2 a").attr("href")?.trim().split(".com")[1] || "";
        const img =
          $(el)
            .find(".body .left a img")
            .attr("src")
            ?.trim()
            .split("thumb/")
            .join("") || "";
        popular.push({
          img,
          title,
          score: "",
          type: "",
          demography: "",
          route: encodeRoute(route),
        });
      }
    );

    return {
      popular,
    };
  };
};
