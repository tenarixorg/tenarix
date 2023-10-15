import React, { createContext, useState, useEffect, useContext } from "react";
import { baseLang } from "./helper";
import { Language } from "types";

const langContext = createContext<Language>(baseLang);

const { api } = window.bridge;

export const LangProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
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
