/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { getImg, content, parser } = require("./scrap");
const { decrypt, encrypt, getHash } = require("./crypto");

module.exports = {
  getImg,
  content,
  parser,
  decrypt,
  encrypt,
  getHash,
};
