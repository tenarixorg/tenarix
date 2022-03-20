import { GetContent, Parser, Read } from "types";
import { decodeRoute } from "utils";

export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string, execPath: string): Promise<Read> => {
    const url = "https://www.mangago.me/" + decodeRoute(id);
    const { innerHTML } = await content(url, execPath, {
      scripts: true,
      headers: {
        referer: url,
        cookie:
          "__utmz=5576751.1643495651.3.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); PHPSESSID=jb1ls79c39ogq79v3c260q64l7; __utmd=dd2a40c1482a0902fce70119433114d1; _mtma=_uc16434921314680.23544352938842783; __utmc=5576751; zoomin=0; __utma=5576751.250655512.1643048811.1643492132.1643495651.3; __utmb=5576751.0.10.1643495651",
      },
    });
    const $ = parser(innerHTML);
    const title = $("#navi .left a").text().trim();
    const info = $("#navi .left span:nth-child(3)").text().trim();
    const imgs: Read["imgs"] = [];
    $("body #pic_container img[id^=page]").each((i, el) => {
      const url = $(el).attr("src")?.trim() || "";
      imgs.push({
        page: i + 1,
        url,
      });
    });
    const pages = imgs.length;
    const id_ = imgs[0].url.split("/").reverse()[0].split(".")[0] || "";
    return {
      id: id_,
      title,
      info,
      pages,
      imgs,
    };
  };
};
