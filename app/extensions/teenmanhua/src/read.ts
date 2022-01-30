import { GetContent, Parser, Read } from "types";
import { decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    const url = "https://teenmanhua.com/" + decodeRoute(id);
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    const imgs: Read["imgs"] = [];
    const base = $(
      "body .wrap .body-wrap .site-content .content-area .container .row .main-col"
    );
    const baseInfo = base.find("h1").text().trim();
    const title = baseInfo.split("-")[0].trim();
    const info = baseInfo.split("-")[1].trim();
    const base1 = base.find(
      ".main-col-inner .c-blog-post .entry-content .entry-content_wrap .read-container .reading-content .page-break img"
    );
    base1.each((i, el) => {
      const url = $(el).attr("src")?.trim() || "";
      imgs.push({
        url,
        free: true,
        page: i + 1,
      });
    });
    const pages = imgs.length;
    const id_ = imgs[0].url.split("/").reverse()[2].split("manga_")[1];
    return {
      id: id_,
      title,
      info,
      pages,
      imgs,
    };
  };
};
