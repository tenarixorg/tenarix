import http from "http";
import https from "https";
import { Readable } from "stream";

export const download = async (url: string) => {
  const proto = !url.charAt(4).localeCompare("s") ? https : http;

  return new Promise<Readable>((resolve, reject) => {
    const request = proto.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      request.end();
      resolve(response);
    });
  });
};
