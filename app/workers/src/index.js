/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { decrypt, encrypt, getHash } = require("./crypto");
const { getImg, content, parser } = require("./scrap");
const { loadJson } = require("./loader");
const { init } = require("./init");

module.exports = {
  getImg,
  content,
  parser,
  decrypt,
  encrypt,
  getHash,
  loadJson,
  init,
};
