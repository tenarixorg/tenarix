import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute, encodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://www.readmng.com" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const base1 = $(
      ".content .container .col-single .row .content-list .movie-meta .panel .panel-heading"
    );
    const base2 = $(
      ".content .container .col-single .row .content-list .movie-meta .panel .panel-body"
    );
    const base3 = $(
      ".content .container .col-single .row .content-list .movie-meta .panel ul.list-group"
    );
    const title = base1.find("h1").text().trim();
    const img = base2.find("img.img-responsive").attr("src")?.trim() || "";
    const status = base2.find(".dl-horizontal dd:nth-of-type(2)").text().trim();
    const description = base3.find("li.movie-detail").text().trim();
    const genres: string[] = [];
    const chapters: Chapter[] = [];
    base2.find(".dl-horizontal dd a[title]").each((_i, el) => {
      const genre = $(el).text().trim();
      genres.push(genre);
    });
    $("#chapters_container .panel .panel-body ul.chp_lst li a").each(
      (_i, el) => {
        const ctitle = $(el).find("span.val").text().trim();
        const id = $(el).attr("href")?.trim().split(".com")[1] || "";
        const src = "read-mng";
        chapters.push({ title: ctitle, links: [{ id: encodeRoute(id), src }] });
      }
    );
    return {
      title,
      description,
      status,
      img,
      type: "",
      genres,
      chapters,
    };
  };
};
