import React, { createContext, useState, useEffect, useContext } from "react";
import { BaseTheme } from "types";
import { initialTheme } from "app-constants";

const themeContext = createContext<BaseTheme>(initialTheme.dark);

const { api } = window.bridge;

export const ThemeProvider: React.FC = ({ children }) => {
  const [colors, setColors] = useState<BaseTheme>(initialTheme.dark);

  useEffect(() => {
    api.on("change:theme", (_e, res) => {
      setColors(res);
    });
    api.send("get:theme");
    return () => {
      api.removeAllListeners("change:theme");
    };
  }, []);

  return (
    <themeContext.Provider value={colors}>{children}</themeContext.Provider>
  );
};

export const useTheme = () => {
  const colors = useContext(themeContext);
  return { colors };
};
