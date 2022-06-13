import React from "react";
import { ThemeProvider, LangProvider } from "context-providers";
import { Pages } from "./pages";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LangProvider>
        <Pages />
      </LangProvider>
    </ThemeProvider>
  );
};
