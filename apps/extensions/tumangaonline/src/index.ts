import { AppContent, GetContent, Parser } from "types";
import { _details } from "./details";
import { _library } from "./library";
import { _home } from "./home";
import { _read } from "./read";

export default (getContent: GetContent, parser: Parser): AppContent => {
  const details = _details(getContent, parser);
  const library = _library(getContent, parser);
  const home = _home(getContent, parser);
  const read = _read(getContent, parser);
  return {
    name: "tu_manga_online",
    details,
    home,
    library,
    read,
    opts: {
      headers: {
        "User-Agent": "curl/7.55.1",
        Accept: "*/*",
        Referer: "https://lectortmo.com",
      },
    },
  };
};
