import { download } from "../src/main/download";
import { getImg } from "../src/main/scraper";
import urls from "./helper/urls";

jest.setTimeout(20000);

describe("Download (download function)", () => {
  test("should download", async () => {
    const res = await download(urls[0]);
    expect(res).toBeInstanceOf(Buffer);
  });

  test("should fail the download", async () => {
    try {
      await download(urls[1]);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Download (getImg function)", () => {
  test("should download", async () => {
    const res = await getImg(urls[0]);
    expect(res).toBeInstanceOf(Buffer);
  });

  test("should fail the download", async () => {
    try {
      await getImg(urls[0]);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
