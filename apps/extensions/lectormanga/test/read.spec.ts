import { content, parser } from "scraper";
import { readId } from "./helper";
import { _read } from "../src/read";

const read = _read(content, parser);

jest.setTimeout(40000);

describe("Read", () => {
  test("should get Read info", async () => {
    const res = await read(readId);
    expect(res.imgs).toBeInstanceOf(Array);
    expect(res.info).toBeDefined();
    expect(res.pages).toBeDefined();
    expect(res.title).toBeDefined();
    expect(res.imgs.length).toBeGreaterThan(1);
    expect(res.info.length).toBeGreaterThan(0);
    expect(res.pages).toBeGreaterThan(0);
    expect(res.title.length).toBeGreaterThan(0);
  });
});
