import cheerio from "cheerio";
import { Filters, LibItem, Library } from "types";
import { content, encodeRoute } from "./util";

const libraryParams = (page: string, filters?: Filters) => {
  return `https://lectortmo.com/library?order_item=likes_count&order_dir=desc&title=${
    filters?.title || ""
  }&_pg=1&filter_by=${filters?.filterBy || "title"}&type=${
    filters?.type || ""
  }&demography=${filters?.demography || ""}&status=${
    filters?.status || ""
  }&translation_status=${filters?.translationStatus || ""}&webcomic=${
    filters?.webcomic || ""
  }&yonkoma=${filters?.yonkoma || ""}&amateur=${
    filters?.amateur || ""
  }&erotic=${filters?.erotic || ""}&_pg=1&page=${page || 1}`;
};

export const library = async (
  page: string,
  filters?: Filters
): Promise<Library> => {
  const txt = await content(libraryParams(page, filters));
  const $ = cheerio.load(txt);
  const items: LibItem[] = [];
  $("main .row .element a").each((_, e) => {
    const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
    const title = $(e).find(".thumbnail-title h4").text().trim();
    const img = ($(e).find("style").html() as string)
      .split("('")[1]
      .split("')")[0]
      .trim();
    const score = $(e).find(".score").text().trim();
    const type = $(e).find(".book-type").text().trim();
    const demography = $(e).find(".demography").text().trim();
    items.push({
      img,
      title,
      score,
      type,
      demography,
      route: encodeRoute(route),
    });
  });
  return {
    items,
  };
};
