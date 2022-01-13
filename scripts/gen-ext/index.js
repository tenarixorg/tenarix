/* eslint-disable no-undef */
import yargs from "yargs";
import fs from "fs";
import { index, read, home, library, details } from "./template/src/index.js";
import { fileURLToPath } from "url";
import { packagejson } from "./template/packagejson.js";
import { hideBin } from "yargs/helpers";
import { join } from "path";

import {
  tindex,
  tread,
  thome,
  tlibrary,
  tdetails,
  thelper,
} from "./template/test/index.js";

const { n, d, Help } = yargs(hideBin(process.argv)).argv;
const __ext = join(fileURLToPath(import.meta.url), "../../../apps/extensions/");

main(n, d, Help);

async function main(n, d, Help) {
  if (Help) {
    console.log("\nUsage:\n");
    console.log("yarn new:ext -d <ext_directory> -n <ext_name>\n");
    return;
  }

  if (n && d) {
    const __root = join(__ext, `${d}/`);

    if (fs.existsSync(__root)) {
      throw new Error("Directory already exist!");
    }

    console.log("creating files...");

    fs.mkdirSync(join(__root, "src/"), { recursive: true });
    const indexF = fs.createWriteStream(join(__root, "src/", "index.ts"));
    const libraryF = fs.createWriteStream(join(__root, "src/", "library.ts"));
    const readF = fs.createWriteStream(join(__root, "src/", "read.ts"));
    const detailsF = fs.createWriteStream(join(__root, "src/", "details.ts"));
    const homeF = fs.createWriteStream(join(__root, "src/", "home.ts"));
    const packageF = fs.createWriteStream(join(__root, "package.json"));
    fs.mkdirSync(join(__root, "test/helper/"), { recursive: true });
    const tindexF = fs.createWriteStream(
      join(__root, "test/", "index.spec.ts")
    );
    const tlibraryF = fs.createWriteStream(
      join(__root, "test/", "library.spec.ts")
    );
    const treadF = fs.createWriteStream(join(__root, "test/", "read.spec.ts"));
    const tdetailsF = fs.createWriteStream(
      join(__root, "test/", "details.spec.ts")
    );
    const thomeF = fs.createWriteStream(join(__root, "test/", "home.spec.ts"));
    const thelperF = fs.createWriteStream(
      join(__root, "test/helper/", "index.ts")
    );

    indexF.write(index(n), (err) => {
      if (err) throw err;
      indexF.close();
    });

    libraryF.write(library, (err) => {
      if (err) throw err;
      libraryF.close();
    });

    readF.write(read, (err) => {
      if (err) throw err;
      readF.close();
    });

    detailsF.write(details, (err) => {
      if (err) throw err;
      detailsF.close();
    });

    homeF.write(home, (err) => {
      if (err) throw err;
      homeF.close();
    });

    tindexF.write(tindex, (err) => {
      if (err) throw err;
      tindexF.close();
    });

    tlibraryF.write(tlibrary, (err) => {
      if (err) throw err;
      tlibraryF.close();
    });

    treadF.write(tread, (err) => {
      if (err) throw err;
      treadF.close();
    });

    tdetailsF.write(tdetails, (err) => {
      if (err) throw err;
      tdetailsF.close();
    });

    thomeF.write(thome, (err) => {
      if (err) throw err;
      thomeF.close();
    });

    thelperF.write(thelper, (err) => {
      if (err) throw err;
      thelperF.close();
    });

    packageF.write(packagejson(d), (err) => {
      if (err) throw err;
      packageF.close();
    });

    const base = fs.createReadStream(join(__ext, "index.ts"));

    const txt = await streamToString(base);
    base.close();
    const spt = txt.split("\n");
    let i = 0;
    let s = "";
    while (spt[i].startsWith("import")) {
      s += spt[i] + "\n";
      i++;
    }
    s += `import ${d} from "./${d}";\n\n` + spt[i + 1];

    if (spt[i + 1].endsWith("];")) {
      s = s.substring(0, s.length - 2) + ", " + d + "];\n";
    } else {
      s += "\n";
      while (i < spt.length - 3) {
        i++;
        s += spt[i + 1] + "\n";
      }
      s = s.substring(0, s.length - 3) + "  " + d + ",\n" + spt[i + 1] + "\n";
    }

    const final = fs.createWriteStream(join(__ext, "index.ts"));

    final.write(s, (err) => {
      final.close();
      if (err) throw err;
    });

    console.log("done...");
  } else {
    throw new Error("Please provide a valid name and directory!");
  }
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
