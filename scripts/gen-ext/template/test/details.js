export const tdetails = `import { parser, content } from "workers";
import { details_route } from "./helper";
import { _details } from "../src/details";

const details = _details(content, parser);

jest.setTimeout(40000);

describe("Details", () => {
  test("should get details", async () => {
    const res = await details(details_route);
    expect(res.chapters).toBeInstanceOf(Array);
    expect(res.demography).toBeDefined();
    expect(res.description).toBeDefined();
    expect(res.genders).toBeDefined();
    expect(res.img).toBeDefined();
    expect(res.score).toBeDefined();
    expect(res.status).toBeDefined();
    expect(res.subtitle).toBeDefined();
    expect(res.title).toBeDefined();
    expect(res.type).toBeDefined();
    expect(res.description.length).toBeGreaterThan(0);
    expect(res.img.length).toBeGreaterThan(0);
    expect(res.status.length).toBeGreaterThan(0);
    expect(res.title.length).toBeGreaterThan(0);
  });
});
`;