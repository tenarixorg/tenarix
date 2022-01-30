import { GetContent, Parser, Read } from "types";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    const url = "https://lectormanga.com/view_uploads/" + id;
    const { current_url, innerHTML } = await content(url, {
      headers: {
        Referer: "https://lectormanga.com",
      },
    });
    if (current_url.includes("paginated")) {
      const newR = await content(
        current_url.split("/paginated/")[0] + "/cascade",
        {
          headers: {
            Referer: current_url,
          },
        }
      );
      return load(parser, newR.innerHTML, newR.current_url);
    }
    return load(parser, innerHTML, current_url);
  };
};

function load(parser: Parser, innerHTML: string, url: string) {
  const $ = parser(innerHTML);
  const id_ = url.split("/").reverse()[1];
  const title = $("section.container-fluid h1").text().trim();
  const info = $("section.container-fluid h2")
    .text()
    .split("|")[0]
    .trim()
    .replace(/\n/g, "");
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
    info: info.substring(0, info.indexOf("S")) || info,
    pages,
    imgs: urls,
  };
}
