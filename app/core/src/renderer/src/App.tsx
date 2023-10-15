import React from "react";
import { AppProvider } from "context-providers";
import { Pages } from "./pages";

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Pages />
    </AppProvider>
  );
};
