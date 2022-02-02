import { Theme } from "types";

export const initialTheme: Theme = {
  dark: {
    primary: "#2076ee",
    secondary: "#e81c6f",
    background1: "#1a1a1a",
    background2: "#242424",
    fontPrimary: "#eeeeee",
    fontSecondary: "#bebebe",
    navbar: {
      background: "#000000",
      buttons: {
        background: "transparent",
        color: "#ffffff",
        hover: "#c4c4c42f",
      },
    },
    buttons: {
      background: "transparent",
      hover: "#4e4e4e32",
      color: "#ffffff",
      border: "#333333b9",
    },
  },
  light: {
    primary: "#2076ee",
    secondary: "#e81c6f",
    background1: "#f0f0f0",
    background2: "#e1e1e1",
    fontPrimary: "#000000",
    fontSecondary: "#1a1a1a",
    navbar: {
      background: "#ffffff",
      buttons: {
        background: "transparent",
        color: "#000000",
        hover: "#c4c4c42f",
      },
    },
    buttons: {
      background: "transparent",
      hover: "#4e4e4e32",
      color: "#000000",
      border: "#33333340",
    },
  },
};

export const initialFolders = (slang: string, currentThemeSchema: string) => [
  { name: ".dreader" },
  {
    name: "themes",
    files: [
      { name: "basic.json", content: JSON.stringify(initialTheme, null, "\t") },
    ],
  },
  {
    name: "config",
    files: [
      {
        name: "settings.json",
        content: JSON.stringify(
          {
            app: {
              lang: slang,
              theme: {
                schema: currentThemeSchema,
                file: "basic.json",
              },
            },
          },
          null,
          "\t"
        ),
      },
    ],
  },
];
