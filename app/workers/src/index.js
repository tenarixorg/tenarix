/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { getImg, content, parser } = require("./scrap");
const { extractFiles } = require("./extractor");
const { loadFile } = require("./loader");
const { getHash } = require("./crypto");
const { init } = require("./init");

module.exports = {
  init,
  getImg,
  parser,
  content,
  getHash,
  loadFile,
  extractFiles,
};
