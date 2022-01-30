import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute, encodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://www.mangago.me/" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const genres: string[] = [];
    const chapters: Chapter[] = [];
    const base = $("#page .people-panel");
    const title = base.find(".w-title h1").text().trim();
    const base1 = base.find(".article #information");
    const img = base1.find("div.left.cover img").attr("src")?.trim() || "";
    const description = base1.find(".manga_summary").text().trim();
    const status = base1
      .find(".manga_right table.left tr:first-child td span")
      .first()
      .text()
      .trim();
    $(".manga_right table.left tr:nth-child(3) td a").each((_i, el) => {
      const gender = $(el).text().trim();
      genres.push(gender);
    });
    base1.find("#chapter_table tr").each((_i, el) => {
      const base_ = $(el).find("td:first-child h4 a");
      const title = base_.text().trim();
      const id = base_.attr("href")?.trim().split(".me/")[1] || "";
      chapters.push({
        title,
        links: [
          {
            src: "mangago",
            id: encodeRoute(id),
          },
        ],
      });
    });
    return {
      title,
      img,
      status,
      type: "Manga",
      description,
      genres,
      chapters,
    };
  };
};
