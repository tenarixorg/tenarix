import { getContent } from "./helper";
import { extensions } from "extensions";
import { AppContent } from "types";
import { parser } from "scraper";

interface Base {
  [name: string]: Omit<AppContent, "name">;
}

const base: Base = {};

for (const ext of extensions) {
  const res = ext(getContent, parser);
  Object.assign(base, {
    [res.name]: {
      home: res.home,
      details: res.details,
      library: res.library,
      read: res.read,
      opts: res.opts,
    },
  });
}

export default base;
