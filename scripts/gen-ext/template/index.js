export const index = (
  name
) => `import { AppContent, GetContent, Parser } from "types";
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
    name: "${name}",
    details,
    home,
    library,
    read
  };
};
`;

export * from "./details.js";
export * from "./home.js";
export * from "./library.js";
export * from "./read.js";
export * from "./packagejson.js";
export * from "./tsconfig.js";
