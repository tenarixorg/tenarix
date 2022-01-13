import { languages } from "languages";
import { Language } from "types";

interface Base {
  [id: string]: Omit<Language, "id">;
}

const base: Base = {};

for (const lang of languages) {
  Object.assign(base, {
    [lang.id]: {
      name: lang.name,
      home: lang.home,
      library: lang.library,
      favorites: lang.favorites,
      extensions: lang.extensions,
      details: lang.details,
      settings: lang.settings,
    },
  });
}

export default base;
