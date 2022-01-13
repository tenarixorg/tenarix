import { DetailsAction, DetailsState } from "types";

export const reducer = (
  state: DetailsState,
  action: DetailsAction
): DetailsState => {
  switch (action.type) {
    case "setData":
      return { ...state, data: action.payload };
    case "reverseChapter":
      return {
        ...state,
        data: { ...state.data, chapters: [...state.data.chapters].reverse() },
      };
    case "setDowns":
      return { ...state, downs: action.payload };
    case "toggleOrder":
      return { ...state, order: !state.order };
    case "toggleShow":
      return { ...state, show: !state.show };
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setFav":
      return { ...state, fav: action.payload };
    default:
      return state;
  }
};

export const initialState: DetailsState = {
  data: {
    chapters: [],
    demography: "",
    description: "",
    genders: [],
    img: "",
    score: "",
    status: "",
    subtitle: "",
    title: "",
    type: "",
  },
  downs: [],
  fav: false,
  loading: true,
  order: true,
  show: false,
};
