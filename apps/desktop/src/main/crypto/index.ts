import {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "crypto";
import { createWriteStream, createReadStream } from "fs";
import { pipeline, Readable, Writable } from "stream";
const algorithm = "aes-192-cbc";
const iv = Buffer.alloc(16, 0);

export const encrypt = (
  password: string,
  outputPath: string,
  input: Readable
) => {
  return new Promise<boolean>((resolve, reject) => {
    const key = scryptSync(password, "salt", 24);
    const cipher = createCipheriv(algorithm, key, iv);
    const output = createWriteStream(outputPath);
    pipeline(input, cipher, output, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

export const decrypt = (password: string, inputP: string) => {
  return new Promise<Buffer>((resolve, reject) => {
    const key = scryptSync(password, "salt", 24);
    const decipher = createDecipheriv(algorithm, key, iv);
    const input = createReadStream(inputP);
    try {
      const data = input.pipe(decipher);
      stream2buffer(data)
        .then(resolve)
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

export const getHash = (data: string) => {
  return new Promise<string>((resolve, reject) => {
    const h = createHash("md5");
    try {
      const res = h.update(data).digest("hex");
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export async function stream2buffer(stream: Writable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream - ${err}`));
  });
}
