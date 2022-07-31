import React from "react";
import { Pages } from "./pages";
import {
  NetProvider,
  LangProvider,
  ThemeProvider,
  GeneralProvider,
} from "context-providers";

export const App: React.FC = () => {
  return (
    <GeneralProvider>
      <NetProvider>
        <ThemeProvider>
          <LangProvider>
            <Pages />
          </LangProvider>
        </ThemeProvider>
      </NetProvider>
    </GeneralProvider>
  );
};
