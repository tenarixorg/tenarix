import { Chapter, ChapterInfo, Details, GetContent, Parser } from "types";
import { decodeRoute } from "./util";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://lectortmo.com/library/" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const chapters: Chapter[] = [];
    const genders: string[] = [];
    $("main ul.list-group li.list-group-item.upload-link").each((_, e) => {
      const title = $(e).find(".btn-collapse").text().trim();
      const links: ChapterInfo[] = [];
      $(e)
        .find("li.list-group-item")
        .each((_i, el) => {
          const src = $(el).find(".text-truncate span a").text().trim();
          const uri = $(el)
            .find("a.btn.btn-default.btn-sm")
            .attr("href")
            ?.trim();
          links.push({
            src,
            id: uri?.split("/view_uploads/")[1] || "",
          });
        });
      chapters.push({
        title,
        links,
      });
    });
    const title = $("h1.element-title").text().trim().replace(/\n/g, " ");
    const subtitle = $("h2.element-subtitle").text().trim().replace(/\n/g, " ");
    const description = $("p.element-description").text().trim();
    const status = $("span.book-status").text().trim();
    const img = $("img.book-thumbnail").attr("src")?.trim() || "";
    const type = $("h1.book-type").text().trim();
    const score = $(".score a span").text().trim();
    const demography = $(".demography ").text().trim();
    $("h6 a.badge").each((_, e) => {
      const gender = $(e).text().trim();
      genders.push(gender);
    });
    return {
      title,
      subtitle,
      description,
      status,
      img,
      type,
      score,
      demography,
      genders,
      chapters,
    };
  };
};
