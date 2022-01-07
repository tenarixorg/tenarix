export const tlibrary = `import { content, parser } from "scraper";
import { libraryFilters } from "./helper";
import { _library } from "../src/library";

const library = _library(content, parser);

jest.setTimeout(40000);

describe("Library", () => {
  test("should get Library page", async () => {
    const res = await library("1", libraryFilters);
    expect(res.items).toBeInstanceOf(Array);
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items[0].title).toBeDefined();
    expect(res.items[0].img).toBeDefined();
    expect(res.items[0].type).toBeDefined();
    expect(res.items[0].score).toBeDefined();
    expect(res.items[0].route).toBeDefined();
    expect(res.items[0].demography).toBeDefined();
  });
});
`;
