/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const { resolve } = require("path");

/**
 *
 * @param {string} basePath
 * @param  {{name:string, files?:{name: string; content: string}[]}[]} folders
 */

/* istanbul ignore next */
const init = (basePath, folders) => {
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
  for (const folder of folders) {
    const path_ = `${basePath}/${folder.name}`;
    if (!fs.existsSync(path_)) fs.mkdirSync(path_, { recursive: true });
    if (folder.files && folder.files.length > 0) {
      for (const file of folder.files) {
        const _path = resolve(path_, file.name);
        if (!fs.existsSync(_path)) {
          const writer = fs.createWriteStream(_path);
          writer.write(file.content, (err) => {
            if (err) throw err;
            writer.close();
          });
        }
      }
    }
  }
};

module.exports = {
  init,
};
