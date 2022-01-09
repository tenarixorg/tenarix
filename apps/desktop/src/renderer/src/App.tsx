import React from "react";
import { ThemeProvider } from "context-providers";
import { Main } from "base";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};
