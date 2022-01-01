import cheerio from "cheerio";
import { Read } from "types";
import { content } from "./util";

export const read = async (id: string): Promise<Read> => {
  const url = `https://lectortmo.com/view_uploads/${id}`;
  const { current_url, innerHTML } = await content(url);
  if (current_url.endsWith("paginated")) {
    const newR = await content(current_url.replace(/paginated/, "cascade"));
    return load(newR.innerHTML);
  }
  return load(innerHTML);
};

function load(innerHTML: string) {
  const $ = cheerio.load(innerHTML);
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
  const imgs = $("img");
  const pages = imgs.length;

  const urls: Read["imgs"] = [];

  imgs.each((i, el) => {
    const url = $(el).attr("data-src") || "";
    urls.push({ url, page: i + 1 });
  });

  return {
    id: id_,
    title,
    info,
    pages,
    imgs: urls,
  };
}
