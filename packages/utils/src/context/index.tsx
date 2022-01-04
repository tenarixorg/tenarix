import React, { createContext, useState, useEffect, useContext } from "react";
import { Theme, theme } from "../theme";

const themeContext = createContext<Theme["dark"]>(theme.dark);

const { api } = window.bridge;

export const ThemeProvider: React.FC = ({ children }) => {
  const [colors, setColors] = useState<Theme["dark"]>(theme.dark);

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
