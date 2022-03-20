import axios from "axios";
import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

axios.defaults.adapter = require("axios/lib/adapters/http");

const libraryParams = (page: string, filters?: Filters) => {
  return `action=madara_load_more&page=${page}&template=madara-core%2Fcontent%2Fcontent-search&vars%5Bs%5D=${
    filters?.title || ""
  }&vars%5Borderby%5D=&vars%5Bpaged%5D=1&vars%5Btemplate%5D=search&vars%5Bmeta_query%5D%5B0%5D%5Bs%5D=${
    filters?.title || ""
  }&vars%5Bmeta_query%5D%5B0%5D%5Borderby%5D=&vars%5Bmeta_query%5D%5B0%5D%5Bpaged%5D=1&vars%5Bmeta_query%5D%5B0%5D%5Btemplate%5D=search&vars%5Bmeta_query%5D%5B0%5D%5Bmeta_query%5D%5Brelation%5D=AND&vars%5Bmeta_query%5D%5B0%5D%5Bpost_type%5D=wp-manga&vars%5Bmeta_query%5D%5B0%5D%5Bpost_status%5D=publish&vars%5Bmeta_query%5D%5Brelation%5D=AND&vars%5Bpost_type%5D=wp-manga&vars%5Bpost_status%5D=publish&vars%5Bmanga_archives_item_layout%5D=default`;
};

export const _library = (_content: GetContent, parser: Parser) => {
  return async (
    page: string,
    _execPath: string,
    filters?: Filters
  ): Promise<Library> => {
    const res = await axios.post(
      "https://teenmanhua.com/wp-admin/admin-ajax.php",
      libraryParams(page, filters),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://teenmanhua.com",
          Referer: "https://teenmanhua.com/?s=&post_type=wp-manga",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const $ = parser(res.data);
    const items: PageBase[] = [];
    $(".c-tabs-item__content").each((_i, el) => {
      const base1 = $(el).find(".col-4 a");
      const img = base1.find("img").attr("src")?.trim() || "";
      const route = base1.attr("href")?.trim().split(".com/")[1] || "";
      const title = $(".col-8 .post-title h3 a").text().trim();
      items.push({
        img,
        title,
        route: encodeRoute(route),
        type: "Manga",
      });
    });
    return {
      items,
    };
  };
};
