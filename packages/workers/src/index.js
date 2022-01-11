/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { decrypt, encrypt } = require("./crypto");
const { getImg, content } = require("./scrap");

module.exports = {
  getImg,
  content,
  decrypt,
  encrypt,
};
