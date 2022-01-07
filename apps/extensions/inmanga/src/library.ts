import { Filters, GetContent, LibItem, Library, Parser } from "types";
import { encodeRoute } from "utils";

const libraryParams = (query: string) => {
  return `https://inmanga.com/manga/consult?suggestion=${query}`;
};

export const _library = (content: GetContent, parser: Parser) => {
  return async (_page: string, filters?: Filters): Promise<Library> => {
    const baseUrl = "https://inmanga.com";
    const { innerHTML } = await content(libraryParams(filters?.title || ""), {
      scripts: true,
      action: async (page) => {
        await page.waitForSelector("a.manga-result");
      },
    });
    const $ = parser(innerHTML);
    const items: LibItem[] = [];
    $("#MangaConsultResult a.manga-result").each((_, el) => {
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
        score: "",
        type: type.substring(0, type.length - 2),
        demography: "",
      });
    });
    return {
      items,
    };
  };
};
