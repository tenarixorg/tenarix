import { LibraryAction, LibraryState } from "types";

export const initialState: LibraryState = {
  data: [],
  loading: true,
  page: 1,
};

export const reducer = (
  state: LibraryState,
  action: LibraryAction
): LibraryState => {
  switch (action.type) {
    case "setData":
      return { ...state, data: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setPage":
      return { ...state, page: action.payload };
    case "incrementPage":
      return { ...state, page: state.page + action.payload };
    case "decrementPage":
      return { ...state, page: state.page - action.payload };
    default:
      return state;
  }
};
