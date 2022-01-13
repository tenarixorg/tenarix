/* eslint-disable no-undef */
import yargs from "yargs";
import fs from "fs";
import { fileURLToPath } from "url";
import { packagejson } from "./template/packagejson.js";
import { hideBin } from "yargs/helpers";
import { tindex } from "./template/test/index.js";
import { index } from "./template/src/index.js";
import { join } from "path";

const { n, u, d, Help } = yargs(hideBin(process.argv)).argv;
const __lang = join(fileURLToPath(import.meta.url), "../../../apps/languages/");

main(n, u, d, Help);

async function main(n, u, d, Help) {
  if (Help) {
    console.log("\nUsage:\n");
    console.log(
      "yarn new:lang -d <lang_directory> -u <land_id> -n <lang_name>\n"
    );
    return;
  }

  if (u && d && n) {
    const __root = join(__lang, `${d}/`);

    if (fs.existsSync(__root)) {
      throw new Error("Directory already exist!");
    }

    console.log("creating files...");

    fs.mkdirSync(join(__root, "src/"), { recursive: true });
    fs.mkdirSync(join(__root, "test/"), { recursive: true });
    const indexF = fs.createWriteStream(join(__root, "src/", "index.ts"));
    const packageF = fs.createWriteStream(join(__root, "package.json"));
    const tindexF = fs.createWriteStream(
      join(__root, "test/", "index.spec.ts")
    );

    indexF.write(index(u, n), (err) => {
      if (err) throw err;
      indexF.close();
    });

    tindexF.write(tindex(u), (err) => {
      if (err) throw err;
      tindexF.close();
    });

    packageF.write(packagejson(d), (err) => {
      if (err) throw err;
      packageF.close();
    });

    const base = fs.createReadStream(join(__lang, "index.ts"));

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

    const final = fs.createWriteStream(join(__lang, "index.ts"));

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
