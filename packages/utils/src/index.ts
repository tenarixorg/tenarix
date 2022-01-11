import { createHash } from "crypto";

export const encodeRoute = (data: string) => {
  return data.replace(/\//g, "=");
};

export const decodeRoute = (enco: string) => {
  return enco.replace(/=/g, "/");
};

export const getHash = (data: string) => {
  return new Promise<string>((resolve, reject) => {
    const h = createHash("md5");
    try {
      const res = h.update(data).digest("hex");
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const capitalize = (data: string) =>
  data[0].toUpperCase() + data.slice(1);

export const format_ext = (source: string) =>
  source.split("_").reduce((acc, curr) => acc + " " + capitalize(curr), "");

export * from "./theme";
