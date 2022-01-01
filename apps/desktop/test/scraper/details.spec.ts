import { details, encodeRoute } from "../../src/main/scraper";
import { detailsRoute } from "./helper";

jest.setTimeout(30000);

describe("Details", () => {
  test("should get Details page", async () => {
    const res = await details(encodeRoute(detailsRoute));
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
  });
});
