export const encodeRoute = (data: string) => {
  return data.replace(/=/g, "^").replace(/\//g, "=").replace(/\?/g, ")");
};

export const decodeRoute = (enco: string) => {
  return enco.replace(/=/g, "/").replace(/\)/g, "?").replace(/\^/g, "=");
};

export const capitalize = (data: string) =>
  data[0].toUpperCase() + data.slice(1);

export const format_ext = (source: string) =>
  source.split("_").reduce((acc, curr) => acc + " " + capitalize(curr), "");

export * from "./theme";
