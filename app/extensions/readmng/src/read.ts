import { GetContent, Parser, Read } from "types";
import { capitalize, decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string, execPath: string): Promise<Read> => {
    const url = `https://www.readmng.com${decodeRoute(id)}/all-pages`;
    const { innerHTML } = await content(url, execPath);
    const $ = parser(innerHTML);
    const title = capitalize(id.split("=")[1].replace(/-/g, " ") || "");
    const info = "Chapter " + id.split("=")[2].replace(/\(/g, ".");
    const imgs = $(".content .container .col-left .row .content-list img");
    const pages = imgs.length;
    const urls: Read["imgs"] = [];
    imgs.each((i, el) => {
      const url_ = $(el).attr("src")?.trim() || "";
      urls.push({ url: url_, page: i + 1 });
    });
    const id_ = urls[0].url
      .split("/chapter_files/")[1]
      .replace(/\//g, "")
      .split(".")[0];
    return {
      id: id_,
      title,
      info,
      pages,
      imgs: urls,
    };
  };
};
