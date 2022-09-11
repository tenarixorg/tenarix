import axios from "axios";
import { ExtensionPlugin, Lang, SelectItem, Source } from "types";
import dns from "dns";

export const encodeRoute = (data: string) => {
  return data
    .replace(/=/g, "^")
    .replace(/\//g, "=")
    .replace(/\?/g, ")")
    .replace(/\./g, "(");
};

export const decodeRoute = (enco: string) => {
  return enco
    .replace(/=/g, "/")
    .replace(/\)/g, "?")
    .replace(/\^/g, "=")
    .replace(/\(/g, ".");
};

export const capitalize = (data: string) =>
  data[0].toUpperCase() + data.slice(1);

export const format_ext = (source: string) =>
  source
    .split("_")
    .reduce((acc, curr) => acc + " " + capitalize(curr), "")
    .trim();

export const sourcesFilter =
  (pinnedOnly: boolean, query: string, slangs: SelectItem[]) => (u: Source) => {
    const txt = format_ext(u.ext).toLowerCase().includes(query.toLowerCase());
    const lang = !!slangs.find((k) => k.value === u.lang);
    const cond0 = txt && u.pinned;
    const cond1 = cond0 && lang;
    const cond2 = txt && lang;
    if (slangs.length > 0) {
      return pinnedOnly ? (cond1 ? u : undefined) : cond2 ? u : undefined;
    } else {
      return pinnedOnly ? (cond0 ? u : undefined) : txt ? u : undefined;
    }
  };

export const langs2SelectOptions = (langs: Lang[]): SelectItem[] => {
  const res = langs.map((lang) => {
    return {
      value: lang.id,
      label: lang.name,
    };
  });
  return res;
};

export const getAllExt = (baseExt: object, check: (ext: string) => boolean) =>
  Object.keys(baseExt).map((ext_) => ({
    ext: ext_,
    lang: (baseExt as any)[ext_].lang,
    pinned: check(ext_),
  }));

export const matchSystemLang = (
  langs: string[],
  systemLang: string,
  defaultLang: string
) => {
  const slang = langs.find((lg) => systemLang.toLowerCase().includes(lg));
  return slang || defaultLang;
};

export const toastMessageFormat = (msg: string): string => {
  if (msg.length > 38) {
    return (
      msg.substring(0, 38) +
      "\n" +
      toastMessageFormat(msg.substring(38, msg.length))
    );
  }
  return msg;
};

export const checkInternetConnection = (off?: boolean) => {
  if (off) return Promise.resolve(false);

  return new Promise<boolean>((res) => {
    dns.lookup("google.com", { family: 4, hints: 0 }, (err, address) => {
      if (err && !address) {
        res(false);
      } else {
        res(true);
      }
    });
  });
};

export const getAllExtensions = async (
  url: string
): Promise<ExtensionPlugin[]> => {
  axios.defaults.adapter = require("axios/lib/adapters/http");
  const res = await axios.get<{ ok: boolean; data: ExtensionPlugin[] }>(url);
  if (res.data.ok) return res.data.data;
  else return [];
};
