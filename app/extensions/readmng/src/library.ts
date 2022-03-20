import { Filters, GetContent, PageBase, Library, Parser } from "types";
import axios from "axios";
import { encodeRoute } from "utils";

axios.defaults.adapter = require("axios/lib/adapters/http");

const libraryParams = (_page: string, filters?: Filters) => {
  return `type=all&manga-name=${
    filters?.title || ""
  }&author-name=&artist-name=&status=both`;
};

export const _library = (_content: GetContent, parser: Parser) => {
  return async (
    page: string,
    _execPath: string,
    filters?: Filters
  ): Promise<Library> => {
    const res = await axios.post(
      "https://www.readmng.com/service/advanced_search",
      libraryParams(page, filters),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Referer: "https://www.readmng.com/advanced-search",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const $ = parser(res.data);
    const items: PageBase[] = [];
    $(".style-list .box").each((_i, el) => {
      const base = $(el).find(".title h2 a");
      const title = base.text().trim();
      const route = base.attr("href")?.trim().split(".com")[1] || "";
      const base2 = $(el).find(".body");
      const img =
        base2
          .find(".left a img")
          .attr("src")
          ?.trim()
          .split("thumb/")
          .join("") || "";
      items.push({
        img,
        route: encodeRoute(route),
        title,
        type: "Manga",
      });
    });
    return {
      items,
    };
  };
};
