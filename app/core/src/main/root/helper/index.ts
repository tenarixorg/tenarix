import { Content, Folder, Opts, Read } from "types";
import { worker } from "./worker";

export const downloadEncrypt = async (
  base: string,
  prefix: string,
  imgs: Read["imgs"],
  headers?: Record<string, string>
) => {
  const res = await worker<boolean>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {resolve, join} = require("path");
    const fs = require("fs");
    
    const [base, prefix, imgs, headers, env] = workerData;
    
    const getNodeModulesPath = (moduleName) =>
      env === "development"
        ? moduleName
        : join(process.cwd(), "resources/app.asar.unpacked/node_modules/" + moduleName);
    
    const dynamicRequire = (moduleName) => {
      const modulePath = getNodeModulesPath(moduleName);
      const module = require(modulePath);
      return module;
    }
    
    const {getImg} = dynamicRequire("workers");

    (async()=>{
      for (const img of imgs) {
        const data = await getImg(img.url, headers);
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
    base,
    prefix,
    imgs,
    headers,
    process.env.NODE_ENV
  );
  return res;
};

export const loadChapter = async (
  base: string,
  prefix: string,
  total: number
) => {
  const res = await worker<Buffer[]>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const fs = require("fs");
    
    const [base, prefix, total, env] = workerData;

    const files = fs.readdirSync(base);
    const res = [];
    for (let i = 0; i < total; i++) {
      const file = prefix + (i+1) + ".jpeg";
      if(!!files.find(u => u === file.replace("/","")))
        res.push(base+file);
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

  return res;
};

export const getContent = async (url: string, opts?: Opts) => {
  let s = "";
  if (opts?.action) {
    s = opts.action.toString();
  }

  const opts_ = {
    headers: opts?.headers || {},
    scripts: opts?.scripts || false,
    action: s,
  };

  const res = await worker<Content>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");

    const [url, opts, env] = workerData;

    const getNodeModulesPath = (moduleName) =>
      env === "development"
        ? moduleName
        : join(process.cwd(), "resources/app.asar.unpacked/node_modules/" + moduleName);

    const dynamicRequire = (moduleName) => {
        const modulePath = getNodeModulesPath(moduleName);
        const module = require(modulePath);
        return module;
    }

    const {content} = dynamicRequire("workers");

    const {headers, scripts, action} = opts;
    let act;
    if(action !== ""){
      act = eval(action);
    }

    (async()=>{
      const res_ = await content(url, {headers, scripts, action: act});
      parentPort.postMessage({done: true, data: res_});
    })();
  `,
    url,
    opts_,
    process.env.NODE_ENV
  );
  return res;
};

export const initFolders = async (basePath: string, folders: Folder[]) => {
  const res = await worker<boolean>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    
    const [basePath, folders, env] = workerData;
    
    const getNodeModulesPath = (moduleName) =>
      env === "development"
        ? moduleName
        : join(process.cwd(), "resources/app.asar.unpacked/node_modules/" + moduleName);
    
    const dynamicRequire = (moduleName) => {
      const modulePath = getNodeModulesPath(moduleName);
      const module = require(modulePath);
      return module;
    }
    
    const {init} = dynamicRequire("workers");
    
    init(basePath,folders);
    parentPort.postMessage({done: true, data: true});
  `,
    basePath,
    folders,
    process.env.NODE_ENV
  );

  return res;
};

export const loadLocalFile = async <T>(
  path: string,
  type: T extends object ? "object" : "string"
) => {
  const res = await worker<T extends object ? T : string>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    
    const [path, type, env] = workerData;
    
    const getNodeModulesPath = (moduleName) =>
      env === "development"
        ? moduleName
        : join(process.cwd(), "resources/app.asar.unpacked/node_modules/" + moduleName);
    
    const dynamicRequire = (moduleName) => {
      const modulePath = getNodeModulesPath(moduleName);
      const module = require(modulePath);
      return module;
    }
    
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

  return res;
};
