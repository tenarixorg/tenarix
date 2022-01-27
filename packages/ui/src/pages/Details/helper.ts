import { DetailsAction, DetailsState } from "types";

const getIds = (chapters: DetailsState["data"]["chapters"]) => {
  const ids_ = [];
  for (let i = 0; i < chapters.length; i++) {
    const element = chapters[i].links[0].id;
    ids_.push(element);
  }
  return ids_;
};

export const reducer = (
  state: DetailsState,
  action: DetailsAction
): DetailsState => {
  switch (action.type) {
    case "setData":
      return {
        ...state,
        data: action.payload,
        ids: getIds([...action.payload.chapters]),
      };
    case "reverseChapter":
      return {
        ...state,
        reverse: !state.reverse,
        data: { ...state.data, chapters: [...state.data.chapters].reverse() },
        ids: getIds([...state.data.chapters].reverse()),
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
    case "setIds":
      return { ...state, ids: action.payload };
    case "setPercentages":
      return { ...state, percentages: action.payload };
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
  reverse: true,
  ids: [],
  downs: [],
  fav: false,
  loading: true,
  order: true,
  show: true,
  percentages: [],
};
