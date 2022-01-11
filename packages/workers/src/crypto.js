/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { scryptSync, createCipheriv, createDecipheriv } = require("crypto");
const { createWriteStream, createReadStream } = require("fs");
const { pipeline } = require("stream");

const algorithm = "aes-192-cbc";
const iv = Buffer.alloc(16, 0);

const encrypt = (password, outputPath, input) => {
  return new Promise((resolve, reject) => {
    const key = scryptSync(password, "salt", 24);
    const cipher = createCipheriv(algorithm, key, iv);
    const output = createWriteStream(outputPath);
    pipeline(input, cipher, output, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

const decrypt = (password, inputP) => {
  return new Promise((resolve, reject) => {
    const key = scryptSync(password, "salt", 24);
    const decipher = createDecipheriv(algorithm, key, iv);
    const input = createReadStream(inputP);
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

module.exports = {
  encrypt,
  decrypt,
};
