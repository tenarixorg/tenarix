import cheerio from "cheerio";
import { Page } from "types";
import { content } from "./util";

export const pages = async (url: string): Promise<Page> => {
  const { innerHTML } = await content(url);
  const $ = cheerio.load(innerHTML);
  const img = $(".img-container img").attr("src")?.trim() || "";
  return {
    img,
  };
};
