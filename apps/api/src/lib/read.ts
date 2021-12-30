import cheerio from "cheerio";
import { Read } from "types";
import { content } from "./util";

export const read = async (url: string): Promise<Read> => {
  const txt = await content(url);
  const $ = cheerio.load(txt);
  const id =
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
    if (pages === NaN || pages === null) {
      pages = 1;
    }
  }

  return {
    id,
    title,
    info,
    pages,
  };
};
