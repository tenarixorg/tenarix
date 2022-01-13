import { ReadAction, ReadState } from "types";

export const reducer = (state: ReadState, action: ReadAction): ReadState => {
  switch (action.type) {
    case "setData":
      return { ...state, data: action.payload };
    case "setImg":
      return { ...state, img: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setLoading2":
      return { ...state, loading2: action.payload };
    case "setLocalImgs":
      return { ...state, localImgs: action.payload };
    case "setRemote":
      return { ...state, remote: action.payload };
    case "setCascade":
      return { ...state, cascade: !state.cascade };
    case "setCurrent":
      return { ...state, current: action.payload };
    case "incrementCurrent":
      return { ...state, current: state.current + action.payload };
    case "decrementCurrent":
      return { ...state, current: state.current - action.payload };
    default:
      return state;
  }
};

export const initialState: ReadState = {
  data: { id: "", imgs: [], info: "", pages: 0, title: "" },
  cascade: false,
  current: 1,
  img: "",
  loading: true,
  loading2: true,
  localImgs: [],
  remote: false,
};
