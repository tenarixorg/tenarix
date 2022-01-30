import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute, encodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://manga1s.com" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const chapters: Chapter[] = [];
    const genres: string[] = [];
    const base = $(".container-fluid .row .container .row");
    const base1 = base.find(
      ".col-12:nth-of-type(3) .novel-info .col-12 .row:first-of-type "
    );
    const base2 = base1.find(".novel-detail .row .novel-info");
    const title = base2.find(".novel-name h1").text().trim();
    const img =
      base1.find(".novel-thumbnail img").attr("data-src")?.trim() || "";
    const status = base2
      .find("label i.fa-flag")
      .parent()
      .parent()
      .find("span")
      .text()
      .trim();
    base2.find(".novel-categories a span").each((_i, el) => {
      const gender = $(el).text().trim();
      genres.push(gender);
    });
    const base3 = base.find(
      ".col-12:nth-of-type(4) .tab-content .tab-pane .chapter-list-item .row"
    );
    const description = base3.find(".col").text().trim();
    const base4 = base.find(
      ".col-12:nth-of-type(5) #chap-list .tab-content .tab-pane .chapter-list-item .row .chapter-wrap .chapter-name h6 a"
    );
    base4.each((_i, el) => {
      const ctitle = $(el).text().trim();
      const id = $(el).attr("href")?.trim() || "";
      chapters.push({
        title: ctitle,
        links: [
          {
            id: encodeRoute(id),
            src: "manga_1s",
          },
        ],
      });
    });
    return {
      img,
      title,
      description,
      status,
      type: "Manga",
      genres,
      chapters,
    };
  };
};
