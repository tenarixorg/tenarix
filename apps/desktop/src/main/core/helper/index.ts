import { worker } from "../worker";
import { Read } from "types";

export const downloadEncrypt = async (
  base: string,
  sufix: string,
  imgs: Read["imgs"],
  headers?: Record<string, string>
) => {
  const res = await worker<boolean>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {getImg, encrypt} = require("workers");
    const {Readable} = require("stream");
    const {resolve} = require("path");

    const [base, sufix, imgs, headers] = workerData;

    (async()=>{
      for (const img of imgs) {
        const data = await getImg(img.url, headers);
        const stream = Readable.from(data);
        await encrypt(
          "some random password",
          resolve(base, sufix + img.page),
          stream
        );
        parentPort.postMessage({done: false,data: "downloaded " + img.page});
      }
      parentPort.postMessage({done: true, data: true});
    })();
  `,
    base,
    sufix,
    imgs,
    headers
  );
  return res;
};

export const decryptChapter = async (base: string, sufix: string) => {
  const res = await worker<Buffer[]>(
    `
    const {workerData, parentPort} = require("worker_threads");
    const {decrypt} = require("workers");

    const [base, sufix] = workerData;

    (async()=>{
      const res_ = [];
      for (let i = 0; i < a.total; i++) {
        const file = base + sufix + (i+1);
        const res_ = await decrypt("some random password", file);
        res.push(res_);
      }
      parentPort.postMessage({done: true, data: res_});
    })();
  `,
    base,
    sufix
  );

  return res;
};
