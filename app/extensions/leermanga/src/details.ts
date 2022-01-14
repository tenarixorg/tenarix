import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute, encodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://r1.leermanga.xyz" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const base = $(".container .row .col-md-8 .container .card");
    const img = base.find(".row .col-4 a img").attr("src")?.trim() || "";
    const title = base.find(".row .col-8 h2").text().trim();
    const status =
      base.find(".row .col-8 table tbody").text().trim().split(": ")[1] ||
      "unknown";
    const description = base
      .find(".row .col-8 p[itemprop=description]")
      .text()
      .trim();
    const genders: string[] = [];
    const chapters: Chapter[] = [];
    base.find(".row .col-12 table td a").each((_i, el) => {
      const gender = $(el).find("span").text().trim();
      genders.push(gender);
    });
    $("#chaptersTable a").each((_i, el) => {
      const ctitle = $(el).text().trim();
      const id = $(el).attr("href")?.trim() || "";
      chapters.push({
        title: ctitle,
        links: [{ src: "leer-manga", id: encodeRoute(id) }],
      });
    });
    return {
      title,
      subtitle: "",
      description,
      status,
      img,
      type: "",
      score: "",
      demography: "",
      genders,
      chapters: chapters.reverse(),
    };
  };
};
