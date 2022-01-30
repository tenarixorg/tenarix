/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  createHash,
} = require("crypto");
const { createWriteStream, createReadStream } = require("fs");
const { pipeline } = require("stream");

const algorithm = "aes-192-cbc";
const iv = Buffer.alloc(16, 0);

/**
 *
 * @param {string} password
 * @param {string} outputPath
 * @param {import("stream").Readable} input
 * @returns {Promise<boolean>}
 */
const encrypt = (password, outputPath, input) => {
  return new Promise((resolve, reject) => {
    const key = scryptSync(password, "salt", 24);
    const cipher = createCipheriv(algorithm, key, iv);
    const output = createWriteStream(outputPath);
    pipeline(input, cipher, output, (err) => {
      /* istanbul ignore next */
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

/**
 *
 * @param {string} password
 * @param {string} inputPath
 * @returns {Promise<Buffer>}
 */
const decrypt = (password, inputPath) => {
  return new Promise((resolve, reject) => {
    const key = scryptSync(password, "salt", 24);
    const decipher = createDecipheriv(algorithm, key, iv);
    const input = createReadStream(inputPath);
    try {
      const data = input.pipe(decipher);
      stream2buffer(data)
        .then(resolve)
        .catch((err) => reject(err));
    } catch (error) {
      /* istanbul ignore next */
      reject(error);
    }
  });
};

function stream2buffer(stream) {
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream - ${err}`));
  });
}

/**
 *
 * @param {string} data
 * @returns {Promise<string>}
 */
const getHash = (data) => {
  return new Promise((resolve, reject) => {
    const h = createHash("md5");
    try {
      const res = h.update(data).digest("hex");
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  encrypt,
  decrypt,
  getHash,
};
