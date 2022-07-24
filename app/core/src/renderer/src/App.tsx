import React from "react";
import { ThemeProvider, LangProvider, NetProvider } from "context-providers";
import { Pages } from "./pages";

export const App: React.FC = () => {
  return (
    <NetProvider>
      <ThemeProvider>
        <LangProvider>
          <Pages />
        </LangProvider>
      </ThemeProvider>
    </NetProvider>
  );
};
