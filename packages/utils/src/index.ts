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

export const getAllExt = (baseExt: object, check: (ext: string) => boolean) =>
  Object.keys(baseExt).map((ext_) => ({
    ext: ext_,
    pinned: check(ext_),
  }));

export const matchSystemLang = (
  langs: string[],
  systemLang: string,
  defaultLang: string
) => {
  const index = systemLang.indexOf("-");
  const slang = langs.find((lg) =>
    lg.includes(
      systemLang.substring(0, index === -1 ? systemLang.length : index)
    )
  );
  return slang || defaultLang;
};

export * from "./theme";
