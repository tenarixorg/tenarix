/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { getHash } = require("../src/crypto");

describe("Hashing", () => {
  test("should get hash", async () => {
    const hash = await getHash("test");
    expect(hash).toBeDefined();
    expect(hash.length).toBeGreaterThan(0);
  });
  test("should fail hashing", async () => {
    let error;
    try {
      await getHash({ test: "test" });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
