import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute, encodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://zahard.xyz/" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const genres: string[] = [];
    const chapters: Chapter[] = [];
    const base = $("body .container-fluid .row:nth-of-type(2) .col-sm-12");
    const base1 = base.find(".row:first-of-type");
    const base2 = base1.find(".col-sm-8 .dl-horizontal");
    const title = base.find("h2.widget-title:first-of-type").text().trim();
    const img = base1.find(".col-sm-4 .boxed img").attr("src")?.trim() || "";
    const status = base2.find("dd:nth-of-type(2) span").text().trim();
    const description = base
      .find(".row:nth-of-type(2) .col-lg-12 .well p")
      .text()
      .trim();
    base2.find("dd a[href*=category]").each((_i, el) => {
      const genre = $(el).text().trim();
      genres.push(genre);
    });
    base
      .find(".row:nth-of-type(4) .col-lg-12 ul.chapters li h5 a")
      .each((_i, el) => {
        const ctitle = $(el).text().trim();
        const id_ = $(el).attr("href")?.trim().split(".xyz/")[1] || "";
        chapters.push({
          title: ctitle,
          links: [
            {
              src: "zahard",
              id: encodeRoute(id_),
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
