/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getImg, content } = require("../src/scrap");

jest.setTimeout(30000);

describe("Get Content", () => {
  test("should get content", async () => {
    const { current_url, innerHTML } = await content("https://example.com");
    expect(innerHTML.length).toBeDefined();
    expect(current_url.length).toBeDefined();
    expect(innerHTML.length).toBeGreaterThan(0);
    expect(current_url.length).toBeGreaterThan(0);
  });
  test("should get content (opts)", async () => {
    const { current_url, innerHTML } = await content(
      "https://lectormanga.com",
      {
        scripts: true,
        imgs: true,
      }
    );
    expect(innerHTML.length).toBeDefined();
    expect(current_url.length).toBeDefined();
    expect(innerHTML.length).toBeGreaterThan(0);
    expect(current_url.length).toBeGreaterThan(0);
  });
  test("should get content (scripts)", async () => {
    const { current_url, innerHTML } = await content("https://example.com", {
      action: async (page) => {
        await page.waitForTimeout(100);
      },
    });
    expect(innerHTML.length).toBeDefined();
    expect(current_url.length).toBeDefined();
    expect(innerHTML.length).toBeGreaterThan(0);
    expect(current_url.length).toBeGreaterThan(0);
  });
});

describe("Get Img", () => {
  test("should get an image", async () => {
    const res = await getImg(
      "https://images.pexels.com/photos/10022783/pexels-photo-10022783.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    );
    expect(res).toBeInstanceOf(Buffer);
    expect(res.length).toBeGreaterThan(0);
  });
});
