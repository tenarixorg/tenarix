import { content, parser } from "../scraper";
import { extensions } from "extensions";
import { AppContent } from "types";

interface Base {
  [name: string]: Omit<AppContent, "name">;
}

const base: Base = {};

for (const ext of extensions) {
  const res = ext(content, parser);
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
