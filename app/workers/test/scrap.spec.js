/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getImg } = require("../src/scrap");

jest.setTimeout(30000);

describe("Get Image", () => {
  test("should get an image", async () => {
    const res = await getImg(
      "https://images.pexels.com/photos/10022783/pexels-photo-10022783.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    );
    expect(res).toBeInstanceOf(Buffer);
    expect(res.length).toBeGreaterThan(0);
  });
});
