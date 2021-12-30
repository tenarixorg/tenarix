import cheerio from "cheerio";
import { HomeBase, Home, HomeBase2 } from "types";
import { encodeRoute, content } from "./util";

export const home = async (): Promise<Home> => {
  const txt = await content("https://lectortmo.com");
  const $ = cheerio.load(txt);
  const popular: HomeBase[] = [];
  const trending: HomeBase[] = [];
  const latest: HomeBase[] = [];
  const updates: HomeBase2[] = [];
  $("main #pills-populars .element a").each((_, e) => {
    const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
    const title = $(e).find(".thumbnail-title h4").text().trim();
    const img = ($(e).find("style").html() as string)
      .split("('")[1]
      .split("')")[0]
      .trim();
    const score = $(e).find(".score").text().trim();
    const type = $(e).find(".book-type").text().trim();
    const demography = $(e).find(".demography").text().trim();
    popular.push({
      img,
      title,
      score,
      type,
      demography,
      route: encodeRoute(route),
    });
  });
  $("main #pills-trending .element a").each((_, e) => {
    const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
    const title = $(e).find(".thumbnail-title h4").text().trim();
    const img = ($(e).find("style").html() as string)
      .split("('")[1]
      .split("')")[0]
      .trim();
    const score = $(e).find(".score").text().trim();
    const type = $(e).find(".book-type").text().trim();
    const demography = $(e).find(".demography").text().trim();
    trending.push({
      img,
      title,
      score,
      type,
      demography,
      route: encodeRoute(route),
    });
  });
  $("main .mt-5 .row .element a").each((_, e) => {
    const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
    const title = $(e).find(".thumbnail-title h4").text().trim();
    const img = ($(e).find("style").html() as string)
      .split("('")[1]
      .split("')")[0]
      .trim();
    const score = $(e).find(".score").text().trim();
    const type = $(e).find(".book-type").text().trim();
    const demography = $(e).find(".demography").text().trim();
    latest.push({
      img,
      title,
      score,
      type,
      demography,
      route: encodeRoute(route),
    });
  });
  $("main #latest_uploads")
    .siblings()
    .find(".col-sm-6 a")
    .each((_, e) => {
      const route = $(e).attr("href")?.trim().split("/library/")[1] || "";
      const title = $(e).find(".thumbnail-title h4").text().trim();
      const img = ($(e).find("style").html() as string)
        .split("('")[1]
        .split("')")[0]
        .trim();
      const type = $(e).find(".book-type").text().trim();
      const chapter = $(e).find(".chapter-number .number").text().trim();
      updates.push({
        img,
        title,
        type,
        chapter,
        route: encodeRoute(route),
      });
    });
  return {
    popular,
    trending,
    latest,
    updates,
  };
};
