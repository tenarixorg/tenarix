import React from "react";
import { GeneralProvider } from "./GeneralProvider";
import { ThemeProvider } from "./ThemeProvider";
import { LangProvider } from "./LangProvider";
import { NetProvider } from "./NetProvider";

export { useGeneral } from "./GeneralProvider";
export { useTheme } from "./ThemeProvider";
export { useLang } from "./LangProvider";
export { useNet } from "./NetProvider";

export const AppProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <GeneralProvider>
      <NetProvider>
        <ThemeProvider>
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
      </NetProvider>
    </GeneralProvider>
  );
};
