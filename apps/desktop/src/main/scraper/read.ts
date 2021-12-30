import cheerio from "cheerio";
import { Read } from "types";
import { content } from "./util";

export const read = async (id: string): Promise<Read> => {
  const url = `https://lectortmo.com/view_uploads/${id}`;
  const txt = await content(url);
  const $ = cheerio.load(txt);
  const id_ =
    $(".pbl.pbl_top .OUTBRAIN")
      .attr("data-src")
      ?.trim()
      .split("/")
      .reverse()[1] || "";
  const title = $("section.container-fluid h1").text().trim();
  const info = $("section.container-fluid h2")
    .text()
    .trim()
    .replace(/\n/g, " ");
  let pages = $("img").length;

  if (pages <= 1) {
    const o = $("option").length;
    const s = $("select").length;
    pages = o / s;
    if (isNaN(pages) || pages === null) {
      pages = 1;
    }
  }

  return {
    id: id_,
    title,
    info,
    pages,
  };
};
