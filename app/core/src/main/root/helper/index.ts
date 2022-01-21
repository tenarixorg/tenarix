import { Content, Opts, Read } from "types";
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
    const {Readable} = require("stream");
    const {resolve, join} = require("path");
    
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
    
    const {getImg, encrypt} = dynamicRequire("workers");

    (async()=>{
      for (const img of imgs) {
        const data = await getImg(img.url, headers);
        const stream = Readable.from(data);
        await encrypt(
          "some random password",
          resolve(base, prefix + img.page),
          stream
        );
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

export const decryptChapter = async (
  base: string,
  prefix: string,
  total: number
) => {
  const res = await worker<Buffer[]>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {join} = require("path");
    
    const [base, prefix, total, env] = workerData;
    
    const getNodeModulesPath = (moduleName) =>
      env === "development"
        ? moduleName
        : join(process.cwd(), "resources/app.asar.unpacked/node_modules/" + moduleName);
    
    const dynamicRequire = (moduleName) => {
      const modulePath = getNodeModulesPath(moduleName);
      const module = require(modulePath);
      return module;
    }
    
    const {decrypt} = dynamicRequire("workers");

    (async()=>{
      const res = [];
      for (let i = 0; i < total; i++) {
        const file = base + prefix + (i+1);
        const res_ = await decrypt("some random password", file);
        res.push(res_);
      }
      parentPort.postMessage({done: true, data: res});
    })();
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
