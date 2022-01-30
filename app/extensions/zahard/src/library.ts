import axios from "axios";
import { Filters, GetContent, PageBase, Library, Parser } from "types";
import { encodeRoute } from "utils";

axios.defaults.adapter = require("axios/lib/adapters/http");

const libraryParams = (_page: string, filters?: Filters) => {
  return `https://zahard.xyz/search?query=${filters?.title || ""}`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const _library = (_content: GetContent, _parser: Parser) => {
  return async (page: string, filters?: Filters): Promise<Library> => {
    const items: PageBase[] = [];
    const res_ = await axios.get<{
      suggestions: { value: string; data: string }[];
    }>(libraryParams(page, filters));
    const res = res_.data.suggestions;
    for (const sugg of res) {
      const title = sugg.value;
      const img = `https://zahard.xyz/uploads/manga/${sugg.data}/cover/cover_250x350.jpg`;
      const route = `manga/${sugg.data}`;
      items.push({
        img,
        title,
        type: "Manga",
        route: encodeRoute(route),
      });
    }
    return {
      items,
    };
  };
};
