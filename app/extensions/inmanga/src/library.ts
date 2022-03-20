import axios from "axios";
import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

axios.defaults.adapter = require("axios/lib/adapters/http");

const libraryParams = (query: string, page: number) => {
  return `filter%5Bgeneres%5D%5B%5D=-1&filter%5BqueryString%5D=${query}&filter%5Bskip%5D=${
    (page - 1) * 10
  }&filter%5Btake%5D=10&filter%5Bsortby%5D=1&filter%5BbroadcastStatus%5D=0&filter%5BonlyFavorites%5D=false&d=`;
};

export const _library = (_content: GetContent, parser: Parser) => {
  return async (
    page: string,
    _execPath: string,
    filters?: Filters
  ): Promise<Library> => {
    const baseUrl = "https://inmanga.com";
    const res_ = await axios.post(
      "https://inmanga.com/manga/getMangasConsultResult",
      libraryParams(filters?.title || "", parseInt(page)),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://inmanga.com",
          Referer: "https://inmanga.com/manga/consult?suggestion=",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50",
        },
      }
    );

    const $ = parser(res_.data);

    const items: PageBase[] = [];
    $("a.manga-result").each((_, el) => {
      const route = $(el).attr("href")?.trim() || "";
      const title = $(el).find(".list-group h4.ellipsed-text").text().trim();
      const img = baseUrl + "/thumbnails" + route.substring(4, route.length);
      const type = $(el)
        .find(".font-size-13 .list-group-item h4.mb0 span.label.pull-right")
        .text()
        .trim()
        .split("/")[0];
      items.push({
        route: encodeRoute(route),
        img,
        title,
        type: type.substring(0, type.length - 2),
      });
    });
    return {
      items,
    };
  };
};
