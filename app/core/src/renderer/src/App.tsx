import React from "react";
import { ThemeProvider, LangProvider } from "context-providers";
import { Main } from "ui";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LangProvider>
        <Main />
      </LangProvider>
    </ThemeProvider>
  );
};
