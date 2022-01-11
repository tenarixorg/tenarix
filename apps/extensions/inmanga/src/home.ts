import axios from "axios";
import { Home, GetContent, Parser, HomeBase } from "types";
import { encodeRoute } from "utils";

axios.defaults.adapter = require("axios/lib/adapters/http");

export const _home = (_content: GetContent, parser: Parser) => {
  return async (): Promise<Home> => {
    const baseUrl = "https://inmanga.com";
    const popular: HomeBase[] = [];

    const res_ = await axios.post(
      baseUrl + "/manga/getMangasConsultResult",
      "filter%5Bgeneres%5D%5B%5D=33&filter%5BqueryString%5D=&filter%5Bskip%5D=0&filter%5Btake%5D=10&filter%5Bsortby%5D=1&filter%5BbroadcastStatus%5D=0&filter%5BonlyFavorites%5D=false&d=",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const $ = parser(res_.data);

    $("a.manga-result").each((_, el) => {
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
