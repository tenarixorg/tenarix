import { GetContent, Parser, Read } from "types";
import { decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string, execPath: string): Promise<Read> => {
    const baseUrl = "https://inmanga.com";
    const url = baseUrl + decodeRoute(id);
    const { innerHTML, current_url } = await content(url, execPath, {
      scripts: true,
      action: async (page) => {
        await page.waitForSelector("img.ImageContainer");
      },
    });
    const $ = parser(innerHTML);
    const title_ = current_url.split("manga/")[1].split("/")[0];
    const title = title_.replace(/-/g, " ");
    const id_ = current_url.split("manga/")[1].split("/")[2];
    const cap = current_url.split("manga/")[1].split("/")[1];
    const info = "Cap. " + cap;
    const imgs_ = $(".PagesContainer  a.NextPage img");
    const pages = imgs_.length;
    const imgs: Read["imgs"] = [];
    const img_base = "https://pack-yak.intomanga.com/images/manga/";
    imgs_.each((i, el) => {
      const _id = $(el).attr("id");
      const url = img_base + `${title_}/chapter/${cap}/page/${i + 1}/${_id}`;
      imgs.push({
        page: i + 1,
        url,
      });
    });
    return {
      id: id_,
      title,
      info,
      pages,
      imgs,
    };
  };
};
