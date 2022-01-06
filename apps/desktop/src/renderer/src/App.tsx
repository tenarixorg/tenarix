import React from "react";
import { Navbar } from "components";
import { Base } from "base";
import { ThemeProvider, useTheme } from "context-providers";
const { api } = window.bridge;

const Main: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div>
      <Navbar
        colors={colors}
        back={() => {
          if (!window.location.href.includes("settings")) window.history.back();
        }}
        home={() => {
          if (!window.location.href.includes("settings"))
            window.location.href = "#/";
        }}
        forward={() => {
          if (!window.location.href.includes("settings"))
            window.history.forward();
        }}
        close={() => {
          api.send("closeApp");
        }}
        maximize={() => {
          api.send("maximizeApp");
        }}
        minimize={() => {
          api.send("minimizeApp");
        }}
        settings={() => {
          if (!window.location.href.includes("settings")) {
            window.history.pushState(
              { prev: window.location.href },
              "",
              "#/settings/source"
            );
            window.location.href = "#/settings/source";
          }
        }}
      />
      <main style={{ marginTop: 22 }}>
        <Base />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};
