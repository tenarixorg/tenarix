import { read } from "../../src/main/scraper";
import { readId } from "./helper";

jest.setTimeout(30000);

describe("Read", () => {
  test("should get Read info", async () => {
    const res = await read(readId);
    expect(res.imgs).toBeInstanceOf(Array);
    expect(res.info).toBeDefined();
    expect(res.pages).toBeDefined();
    expect(res.title).toBeDefined();
  });
});
