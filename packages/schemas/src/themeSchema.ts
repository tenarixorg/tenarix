const common = {
  type: "object",
  properties: {
    primary: { type: "string" },
    secondary: { type: "string" },
    background1: { type: "string" },
    background2: { type: "string" },
    fontPrimary: { type: "string" },
    fontSecondary: { type: "string" },
    navbar: {
      type: "object",
      properties: {
        background: { type: "string" },
        buttons: {
          type: "object",
          properties: {
            background: { type: "string" },
            color: { type: "string" },
            hover: { type: "string" },
          },
          required: ["background", "color", "hover"],
        },
      },
      required: ["background", "buttons"],
    },
    buttons: {
      type: "object",
      properties: {
        background: { type: "string" },
        hover: { type: "string" },
        color: { type: "string" },
        border: { type: "string" },
      },
      required: ["background", "hover", "color", "border"],
    },
  },
  required: [
    "navbar",
    "buttons",
    "primary",
    "secondary",
    "background1",
    "background2",
    "fontPrimary",
    "fontSecondary",
  ],
};

export const themeSchema = {
  type: "object",
  properties: {
    dark: common,
    light: common,
  },
  required: ["dark", "light"],
  additionalProperties: false,
};
