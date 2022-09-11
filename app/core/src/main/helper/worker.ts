import { Content, Folder, Opts, Read } from "types";
import { Worker } from "worker_threads";

export const worker = <T>(fn: string, ...data: any[]) => {
  return new Promise<T>((res, rej) => {
    const worker = new Worker(fn, {
      workerData: data,
      eval: true,
    });
    worker.on("message", (msg) => {
      if (msg.done) {
        res(msg.data);
      } else {
        // eslint-disable-next-line no-console
        console.log(msg.data);
      }
    });
    worker.on("error", rej);
    worker.on(
      "exit",
      (c) => c !== 0 && rej(new Error("worker stopped with code" + c))
    );
  });
};

const common = `
const getNodeModulesPath = (moduleName) =>
  env === "development"
    ? moduleName
    : join(process.cwd(), "resources/app.asar.unpacked/node_modules/" + moduleName);

const dynamicRequire = (moduleName) => {
  const modulePath = getNodeModulesPath(moduleName);
  const module = require(modulePath);
  return module;
}
`;

export const downloadChapter = (
  execPath: string,
  base: string,
  prefix: string,
  imgs: Read["imgs"],
  headers?: Record<string, string>
) => {
  return worker<boolean>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {resolve, join} = require("path");
    const fs = require("fs");
    
    const [execPath, base, prefix, imgs, headers, env] = workerData;
    
    ${common}
    
    const {getImg} = dynamicRequire("workers");

    (async()=>{
      for (const img of imgs) {
        const data = await getImg(img.url, execPath, headers);
        const file = fs.createWriteStream(resolve(base, prefix + img.page) + ".jpeg");
        file.write(data, (err)=>{
          if(err) throw err;
          file.close();
        });
        parentPort.postMessage({done: false,data: "downloaded " + img.page});
      }
      parentPort.postMessage({done: true, data: true});
    })();
  `,
    execPath,
    base,
    prefix,
    imgs,
    headers,
    process.env.NODE_ENV
  );
};

export const loadChapter = (base: string, prefix: string, total: number) => {
  return worker<Buffer[]>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    const fs = require("fs");
    
    const [base, prefix, total, env] = workerData;

    const files = fs.readdirSync(base);
    const res = [];
    for (let i = 0; i < total; i++) {
      const file = prefix + (i+1) + ".jpeg";
      if(!!files.find(u => u === file.replace("/","")))
        res.push(join(base,file));
      else 
        res.push("");
    }
    parentPort.postMessage({done: true, data: res});
  `,
    base,
    prefix,
    total,
    process.env.NODE_ENV
  );
};

export const getContent = (url: string, execPath: string, opts?: Opts) => {
  let s = "";
  if (opts?.action) {
    s = opts.action.toString();
  }

  const opts_ = {
    headers: opts?.headers || {},
    scripts: opts?.scripts || false,
    action: s,
  };

  return worker<Content>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");

    const [url, execPath, opts, env] = workerData;

    ${common}

    const {content} = dynamicRequire("workers");

    const {headers, scripts, action} = opts;
    let act;
    if(action !== ""){
      act = eval(action);
    }

    (async()=>{
      const res_ = await content(url, execPath, {headers, scripts, action: act});
      parentPort.postMessage({done: true, data: res_});
    })();
  `,
    url,
    execPath,
    opts_,
    process.env.NODE_ENV
  );
};

export const initFolders = (basePath: string, folders: Folder[]) => {
  return worker<boolean>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    
    const [basePath, folders, env] = workerData;
    
    ${common}
    
    const {init} = dynamicRequire("workers");
    
    init(basePath,folders);
    parentPort.postMessage({done: true, data: true});
  `,
    basePath,
    folders,
    process.env.NODE_ENV
  );
};

export const loadLocalFile = <T>(
  path: string,
  type: T extends object ? "object" : "string"
) => {
  return worker<T extends object ? T : string>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    
    const [path, type, env] = workerData;
    
    ${common}
    
    const {loadFile} = dynamicRequire("workers");

    (async()=>{
      const res_ = await loadFile(path,type);
      parentPort.postMessage({done: true, data: res_});
    })();
  `,
    path,
    type,
    process.env.NODE_ENV
  );
};

export const extractLocalFiles = (
  path: string,
  outDir: string,
  tar?: boolean
) => {
  return worker<void>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    
    const [path, outDir, tar, env] = workerData;
    
    ${common}
    
    const {extractFiles} = dynamicRequire("workers");

    (async()=>{
      const res_ = await extractFiles(path, outDir, tar);
      parentPort.postMessage({done: true, data: res_});
    })();
  `,
    path,
    outDir,
    tar,
    process.env.NODE_ENV
  );
};
