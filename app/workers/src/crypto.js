/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { createHash } = require("crypto");

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
  getHash,
};
