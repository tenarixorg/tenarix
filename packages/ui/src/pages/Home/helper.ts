import { HomeAction, HomeState } from "types";

export const initialState: HomeState = {
  data: {
    popular: [],
  },
  loading: true,
};

export const reducer = (state: HomeState, action: HomeAction): HomeState => {
  switch (action.type) {
    case "setData":
      return { ...state, data: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
