/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const extract = require("extract-zip");
const { extract: extract_tar } = require("tar");
const fs = require("fs");

/**
 *
 * @param {string} path
 * @param {string} outDir
 * @param {string} oldName
 * @param {string} newName
 */
const extractFiles = async (path, outDir, tar) => {
  if (tar) {
    await extract_tar({
      file: path,
      cwd: outDir,
    });
  } else {
    await extract(path, {
      dir: outDir,
    });
  }
  fs.unlinkSync(path);
};

module.exports = {
  extractFiles,
};
