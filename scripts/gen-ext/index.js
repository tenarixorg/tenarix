/* eslint-disable no-undef */
import yargs from "yargs";
import fs from "fs";
import { fileURLToPath } from "url";
import { hideBin } from "yargs/helpers";
import { join } from "path";
import {
  index,
  read,
  home,
  library,
  details,
  packagejson,
  tsconfig,
} from "./template/index.js";

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
    const tsconfigF = fs.createWriteStream(join(__root, "tsconfig.json"));
    const packageF = fs.createWriteStream(join(__root, "package.json"));

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
    tsconfigF.write(tsconfig, (err) => {
      if (err) throw err;
      tsconfigF.close();
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

    s = s.substring(0, s.length - 2) + ", " + d + "];\n";

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
