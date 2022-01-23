import { GetContent, Parser, Read } from "types";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    const url = `https://lectortmo.com/view_uploads/${id}`;
    const { current_url, innerHTML } = await content(url);
    if (current_url.endsWith("paginated")) {
      const newR = await content(current_url.replace(/paginated/, "cascade"));
      return load(parser, newR.innerHTML);
    }
    return load(parser, innerHTML);
  };
};

function load(parser: Parser, innerHTML: string) {
  const $ = parser(innerHTML);
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
    urls.push({ url, page: i + 1, free: false });
  });

  return {
    id: id_,
    title,
    info: info.substring(0, info.indexOf("S")),
    pages,
    imgs: urls,
  };
}
