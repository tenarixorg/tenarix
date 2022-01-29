export const settingsSchema = (files: string[]) => ({
  type: "object",
  properties: {
    app: {
      type: "object",
      properties: {
        lang: {
          enum: ["es", "en"],
        },
        theme: {
          type: "object",
          properties: {
            schema: {
              enum: ["dark", "light"],
            },
            file: { enum: files },
          },
          required: ["file", "schema"],
        },
      },
      required: ["lang", "theme"],
    },
  },
  required: ["app"],
  additionalProperties: false,
});
