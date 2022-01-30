/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

/**
 *
 * @param {import("stream").Readable} stream
 * @returns {Promise<string>}
 */
const streamToString = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

/**
 *
 * @param {string} path
 * @returns {Promise<object>}
 */
/* istanbul ignore next */
const loadFile = async (path, type) => {
  if (!fs.existsSync(path)) throw new Error(`${path} doesn't exist.`);
  const stream = fs.createReadStream(path);
  const data = await streamToString(stream);
  if (type === "string") return data;
  const res = JSON.parse(data);
  return res;
};

module.exports = {
  loadFile,
};
