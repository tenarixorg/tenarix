import { Content, Opts, Read } from "types";
import { worker } from "../worker";

export const downloadEncrypt = async (
  base: string,
  prefix: string,
  imgs: Read["imgs"],
  headers?: Record<string, string>
) => {
  const res = await worker<boolean>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {getImg, encrypt} = require("workers");
    const {Readable} = require("stream");
    const {resolve} = require("path");

    const [base, prefix, imgs, headers] = workerData;

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
    headers
  );
  return res;
};

export const decryptChapter = async (base: string, prefix: string) => {
  const res = await worker<Buffer[]>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {decrypt} = require("workers");

    const [base, prefix] = workerData;

    (async()=>{
      const res_ = [];
      for (let i = 0; i < a.total; i++) {
        const file = base + prefix + (i+1);
        const res_ = await decrypt("some random password", file);
        res.push(res_);
      }
      parentPort.postMessage({done: true, data: res_});
    })();
  `,
    base,
    prefix
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
    const {content} = require("workers");

    const [url, opts] = workerData;
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
    opts_
  );
  return res;
};
