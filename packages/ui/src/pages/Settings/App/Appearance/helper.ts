import React from "react";
import { AppearanceAction, AppearanceState } from "types";

export const cleanColor = (e: React.ChangeEvent<HTMLInputElement>) => {
  let v = e.target.value;
  if (v === "") {
    v = "#000000";
  } else if (!v.startsWith("#")) {
    v = "#" + v.slice(0, v.length - 1);
  }
  return v;
};

export const initialState: AppearanceState = {
  loading: true,
  newColors: {
    background1: "",
    background2: "",
    buttons: {
      background: "",
      border: "",
      color: "",
      hover: "",
    },
    fontPrimary: "",
    fontSecondary: "",
    navbar: {
      background: "",
      buttons: {
        background: "",
        color: "",
        hover: "",
      },
    },
    primary: "",
    secondary: "",
  },
  current: "",
  filename: "",
  modal: false,
  options: [],
  values: [{ label: "", value: "" }],
};

export const reducer = (
  state: AppearanceState,
  action: AppearanceAction
): AppearanceState => {
  switch (action.type) {
    case "setCurrent":
      return { ...state, current: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setFilename":
      return { ...state, filename: action.payload };
    case "setModal":
      return { ...state, modal: action.payload };
    case "toggleModal":
      return { ...state, modal: !state.modal };
    case "setNewColors":
      return { ...state, newColors: action.payload };
    case "setOptions":
      return { ...state, options: action.payload };
    case "setValues": {
      console.log(action.payload);

      return { ...state, values: action.payload };
    }
    case "setPrimary":
      return {
        ...state,
        newColors: { ...state.newColors, primary: action.payload },
      };
    case "setSecondary":
      return {
        ...state,
        newColors: { ...state.newColors, secondary: action.payload },
      };
    case "setFontPrimary":
      return {
        ...state,
        newColors: { ...state.newColors, fontPrimary: action.payload },
      };
    case "setFontSecondary":
      return {
        ...state,
        newColors: { ...state.newColors, fontSecondary: action.payload },
      };
    case "setBackground1":
      return {
        ...state,
        newColors: { ...state.newColors, background1: action.payload },
      };
    case "setBackground2":
      return {
        ...state,
        newColors: { ...state.newColors, background2: action.payload },
      };
    case "setNavBackground":
      return {
        ...state,
        newColors: {
          ...state.newColors,
          navbar: { ...state.newColors.navbar, background: action.payload },
        },
      };
    case "setNavBtnsColors":
      return {
        ...state,
        newColors: {
          ...state.newColors,
          navbar: {
            ...state.newColors.navbar,
            buttons: {
              ...state.newColors.navbar.buttons,
              color: action.payload,
            },
          },
        },
      };
    default:
      return state;
  }
};
