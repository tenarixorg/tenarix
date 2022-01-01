import fs from "fs";
import { resolve } from "path";
import { decrypt, encrypt, getHash } from "../src/main/crypto";

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
        null as any
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

describe("Hash", () => {
  test("should be able to hash", async () => {
    const hash = await getHash("some string to hash");
    expect(hash).toBeDefined();
  });
  test("should fail the hash", async () => {
    try {
      await getHash(null as any);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
