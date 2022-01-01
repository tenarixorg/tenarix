import { home } from "../../src/main/scraper";

jest.setTimeout(30000);

describe("Home", () => {
  test("should get Home page", async () => {
    const res = await home();
    expect(res.popular).toBeInstanceOf(Array);
    expect(res.trending).toBeInstanceOf(Array);
    expect(res.latest).toBeInstanceOf(Array);
    expect(res.updates).toBeInstanceOf(Array);
  });
});
