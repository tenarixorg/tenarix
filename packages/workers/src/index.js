/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { decrypt, encrypt } = require("./crypto");
const { getImg } = require("./scrap");

module.exports = {
  getImg,
  decrypt,
  encrypt,
};
