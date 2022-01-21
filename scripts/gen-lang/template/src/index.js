export const index = (id, name) => `import { Language } from "types";

const lang: Language = {
  id: "${id}",
  name: "${name}",
  home: {
    head: "",
  },
  details: {
    chapters: "",
    genders: "",
    status: "",
  },
  library: {
    head: "",
  },
  favorites: {
    head: "",
  },
  extensions: {
    pin_option_text: "",
    search_placeholder: "",
  },
  settings: {
    options_1: {
      advanced: {
        option_text: "",
      },
      language: {
        option_text: "",
        content: {
          head_text: "",
        },
      },
      appearance: {
        option_text: "",
        content: {
          btn_text: "",
          head_text: "",
        },
      },
      head: "",
    },
  },
};

export default lang;
`;