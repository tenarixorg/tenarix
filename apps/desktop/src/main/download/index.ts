import http from "http";
import https from "https";

export const download = async (url: string) => {
  const proto = !url.charAt(4).localeCompare("s") ? https : http;

  return new Promise<Buffer>((resolve, reject) => {
    const request = proto.get(
      url,
      {
        headers: {
          "User-Agent": "curl/7.55.1",
          Accept: "*/*",
          Referer: "https://lectortmo.com",
        },
        timeout: 2000,
      },
      (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          return;
        }
        request.end();

        const buff: any[] = [];
        response.on("data", (c) => {
          buff.push(c);
        });
        response.on("end", () => {
          resolve(Buffer.concat(buff));
        });
        response.on("error", (e) => {
          reject(e);
        });
      }
    );

    request.on("timeout", () => {
      reject(new Error("timeout"));
    });

    request.on("error", (err) => {
      reject(err);
    });
  });
};
