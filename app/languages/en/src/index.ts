import { Language } from "types";

const lang: Language = {
  id: "en",
  name: "English",
  home: {
    head: "Populars",
  },
  details: {
    chapters: "Chapters",
    genders: "Genders",
    status: "Status",
  },
  library: {
    head: "Results",
  },
  favorites: {
    head: "Favorites",
  },
  extensions: {
    pin_option_text: "Pinned Only",
    search_placeholder: "Search...",
    select_title: "Language",
  },
  settings: {
    options_1: {
      advanced: {
        option_text: "Advanced",
      },
      language: {
        option_text: "Language",
        content: {
          head_text: "Language",
          sub_text: "Select a language",
        },
      },
      appearance: {
        option_text: "Appearance",
        content: {
          sub_text1: "Theme",
          sub_text2: "Personalize",
          btn_text1: "Save",
          btn_text2: "Edit",
          head_text: "Appearance",
          radios: {
            text1: "Dark",
            text2: "Light",
          },
        },
      },
      head: "App settings",
    },
  },
};

export default lang;
