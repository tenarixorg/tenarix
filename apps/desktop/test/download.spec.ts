import { download } from "../src/main/download";
import urls from "./helper/urls";

describe("Download", () => {
  test("should download", async () => {
    const res = await download(urls[0], {
      "User-Agent": "curl/7.55.1",
      Accept: "*/*",
      Referer: "https://lectortmo.com",
    });
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
