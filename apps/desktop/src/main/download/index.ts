import http from "http";
import https from "https";
import { Readable } from "stream";
import { stream2buffer } from "../crypto";

const _download = async (url: string) => {
  const proto = !url.charAt(4).localeCompare("s") ? https : http;

  return new Promise<Readable>((resolve, reject) => {
    const request = proto.get(
      url,
      {
        headers: {
          "User-Agent": "curl/7.55.1",
          Accept: "*/*",
          Referer: "https://lectortmo.com",
        },
      },
      (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          return;
        }
        request.end();
        resolve(response);
      }
    );
  });
};

export const download = async (url: string) => {
  const stream = await _download(url);
  return stream2buffer(stream);
};
