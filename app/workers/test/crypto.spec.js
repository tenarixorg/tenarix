/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require("fs");
const { decrypt, encrypt, getHash } = require("../src/crypto");
const { resolve } = require("path");

describe("Encryption", () => {
  test("should encrypt file", async () => {
    const file = fs.createReadStream(resolve(__dirname, "./helper/crypto.txt"));
    const res = await encrypt(
      "some random password",
      resolve(__dirname, "./out_/crypto.txt.enc"),
      file
    );
    expect(res).toEqual(true);
  });

  test("should fail encrypting file", async () => {
    try {
      await encrypt(
        "some random password",
        resolve(__dirname, "./out_/crypto.txt.fail"),
        null
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Decryption", () => {
  test("should decrypt file", async () => {
    const res = await decrypt(
      "some random password",
      resolve(__dirname, "./out_/crypto.txt.enc")
    );
    expect(res).toBeDefined();
  });

  test("should fail decrypting file (wrong password)", async () => {
    try {
      await decrypt(
        "wrong password",
        resolve(__dirname, "./out_/crypto.txt.enc")
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("should fail decrypting file (wrong file)", async () => {
    try {
      await decrypt(
        "some random password",
        resolve(__dirname, "./out_/crypto.txt.fail")
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

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
