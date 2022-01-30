import { Chapter, Details, GetContent, Parser } from "types";
import { decodeRoute, encodeRoute } from "utils";

export const _details = (content: GetContent, parser: Parser) => {
  return async (route: string): Promise<Details> => {
    const url = "https://heavenmanga.com/" + decodeRoute(route);
    const { innerHTML } = await content(url, { scripts: true });
    const $ = parser(innerHTML);
    const chapters: Chapter[] = [];
    const genres: string[] = [];

    const panel = $("table td .listing-chapters_wrap .panel-group");

    const chtitle = panel
      .find("h4.panel-title span.c_title")
      .first()
      .text()
      .trim();

    const chlink = panel
      .find("table .media-body h4.title a")
      .first()
      .attr("href")
      ?.trim();

    const total_c = getMaxChapter(chtitle);

    let baseTitle = "";
    let cp_ = total_c;
    if (chtitle?.endsWith(total_c.toString())) {
      baseTitle = chtitle.substring(
        0,
        chtitle.length - total_c.toString().length
      );
    } else {
      while (!chtitle?.endsWith(cp_.toString())) {
        cp_--;
        if (cp_ <= 0) break;
      }
      baseTitle =
        chtitle?.substring(0, chtitle.length - cp_.toString().length) || "";
    }

    let cp = total_c;
    let baseLink = "";
    if (chlink?.endsWith(total_c.toString())) {
      baseLink = chlink.substring(0, chlink.length - total_c.toString().length);
    } else {
      while (!chlink?.endsWith(cp.toString())) {
        cp--;
        if (cp <= 0) break;
      }
      baseLink =
        chlink?.substring(0, chlink.length - cp.toString().length) || "";
    }
    baseLink = encodeRoute(baseLink.split(".com/")[1]);

    for (let i = 0; i < cp; i++) {
      chapters.push({
        title: baseTitle + (i + 1),
        links: [{ id: baseLink + (i + 1), src: "heaven-manga" }],
      });
    }

    const title = $(".post-title h3").text().trim().replace(/\n/g, " ");
    const description = $(".description-summary .summary__content p")
      .text()
      .trim();
    const status = $(".summary_content .post-status span.label").text().trim();
    const img = $(".summary_image img").attr("data-src")?.trim() || "";

    let type = "";

    $(".summary_content .post-content .post-content_item").each((_i, el) => {
      if ($(el).find(".summary-heading").text().trim().includes("Type")) {
        type = $(el).find(".summary-content").text().trim();
      }
    });

    $(".genres-content a").each((_, e) => {
      const genre = $(e).text().trim();
      genres.push(genre);
    });
    return {
      title,
      description,
      status,
      img,
      type: type || "Manga",
      genres,
      chapters: chapters.reverse(),
    };
  };
};

const getMaxChapter = (title: string): number => {
  const arr = title.split("");

  let s = "";
  for (let i = 0; i < arr.length; i++) {
    const code = arr[i].charCodeAt(0);
    if (code > 47 && code < 58) {
      s += arr[i];
    }
  }

  if (s && title.endsWith(s)) {
    return parseInt(s);
  }

  return 0;
};
