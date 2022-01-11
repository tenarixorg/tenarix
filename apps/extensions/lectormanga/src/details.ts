import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://lectormanga.com/library/" + decodeRoute(route);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const chapters: Chapter[] = [];
    const genders: string[] = [];
    const img =
      $("#app .row .container .col-12 img.img-fluid").attr("src")?.trim() || "";
    const title = $("#app .row .container .col-12 h1.text-dark").text().trim();
    const description = $("#app .row .container .col-12 p").text().trim();
    const type = $("#app .row .container .col-12 h5 span[class^=text]")
      .first()
      .text()
      .trim();
    const status = $("#app .row .container .col-12 h5 span[class^=status]")
      .text()
      .trim();
    $("#app .row .container .col-12 a.badge").each((_i, el) => {
      const gender = $(el).text().trim();
      genders.push(gender);
    });

    const ctitles: string[] = [];
    $("#app .row .col-12 #chapters .row .col-10 h4").each((_i, el) => {
      const ctitle = $(el).text().trim();
      ctitles.push(ctitle.replace(/(\n)/g, ""));
    });
    const clinks: Chapter["links"][] = [];
    $("#app .row .col-12 #chapters ul.list-group").each((i, el) => {
      const links_: Chapter["links"] = [];
      $(el)
        .find("li.list-group-item .row")
        .each((_ii, ele) => {
          const src = $(ele)
            .find("div.col-12.text-truncate span")
            .text()
            .trim();
          const id =
            $(ele)
              .find("div.col-6.text-right a.btn")
              .attr("href")
              ?.trim()
              .split("/view_uploads/")[1] || "";

          links_.push({ src, id });
        });
      clinks.push(links_);
    });

    for (let i = 0; i < ctitles.length; i++) {
      chapters.push({ title: ctitles[i], links: clinks[i] });
    }

    return {
      title,
      subtitle: "",
      description,
      status,
      img,
      type,
      score: "",
      demography: "",
      genders,
      chapters,
    };
  };
};
