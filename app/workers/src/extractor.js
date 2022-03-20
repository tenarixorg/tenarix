/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const extract = require("extract-zip");
const fs = require("fs");

/**
 *
 * @param {string} path
 * @param {string} outDir
 * @param {string} oldName
 * @param {string} newName
 */
const extractFiles = async (path, outDir) => {
  await extract(path, {
    dir: outDir,
  });
  fs.unlinkSync(path);
};

module.exports = {
  extractFiles,
};
