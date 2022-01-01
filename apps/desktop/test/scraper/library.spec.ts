import { library } from "../../src/main/scraper";
import { libraryFilters } from "./helper";

jest.setTimeout(30000);

describe("Library", () => {
  test("should get Library page", async () => {
    const res = await library("1", libraryFilters);
    expect(res.items).toBeInstanceOf(Array);
  });
});
