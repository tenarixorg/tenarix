/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { getImg, content, parser } = require("./scrap");
const { loadFile } = require("./loader");
const { getHash } = require("./crypto");
const { init } = require("./init");

module.exports = {
  getImg,
  content,
  parser,
  getHash,
  loadFile,
  init,
};
