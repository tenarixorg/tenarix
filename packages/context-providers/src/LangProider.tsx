import React, { createContext, useState, useEffect, useContext } from "react";
import { Language } from "types";

const baseLang = {
  id: "",
  home: {
    head: "",
  },
  details: {
    chapters: "",
    genders: "",
    status: "",
  },
  library: {
    head: "",
  },
  favorites: {
    head: "",
  },
  extensions: {
    pin_option_text: "",
    search_placeholder: "",
  },
  settings: {
    options_1: {
      advanced: {
        option_text: "",
      },
      appearance: {
        option_text: "",
        content: {
          btn_text: "",
          head_text: "",
        },
      },
      head: "",
    },
  },
};

const langContext = createContext<Language>(baseLang);

const { api } = window.bridge;

export const LangProvider: React.FC = ({ children }) => {
  const [lang, setLang] = useState<Language>(baseLang);

  useEffect(() => {
    api.on("res:lang", (_e, res) => {
      setLang(res);
    });
    api.send("get:lang");
    return () => {
      api.removeAllListeners("res:lang");
    };
  }, []);

  return <langContext.Provider value={lang}>{children}</langContext.Provider>;
};

export const useLang = () => {
  const lang = useContext(langContext);
  return { lang };
};
