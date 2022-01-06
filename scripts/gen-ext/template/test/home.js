export const thome = `import { parser, content } from "scraper";
import { _home } from "../src/home";

const home = _home(content, parser);

jest.setTimeout(40000);

describe("Home", () => {
  test("should get Home page", async () => {
    const res = await home();
    expect(res.popular).toBeInstanceOf(Array);
    expect(res.popular.length).toBeGreaterThan(0);
    expect(res.popular[0].title).toBeDefined();
    expect(res.popular[0].img).toBeDefined();
    expect(res.popular[0].type).toBeDefined();
    expect(res.popular[0].score).toBeDefined();
    expect(res.popular[0].route).toBeDefined();
    expect(res.popular[0].demography).toBeDefined();
  });
});
`;
