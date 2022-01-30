import { ExtensionsAction, ExtensionsState } from "types";

export const initialState: ExtensionsState = {
  loading: true,
  pinnedOnly: false,
  query: "",
  sources: [],
  langs: [],
  slangs: [],
};

export const reducer = (
  state: ExtensionsState,
  action: ExtensionsAction
): ExtensionsState => {
  switch (action.type) {
    case "setSources":
      return { ...state, sources: action.payload };
    case "setLangs":
      return { ...state, langs: action.payload };
    case "setSlangs":
      return { ...state, slangs: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setPinnedOnly":
      return { ...state, pinnedOnly: action.payload };
    case "setQuery":
      return { ...state, query: action.payload };
    default:
      return state;
  }
};
