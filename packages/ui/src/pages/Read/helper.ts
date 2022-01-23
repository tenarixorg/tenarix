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
    case "setImgWidth": {
      const newWidth = action.payload as string;
      const width = parseInt(newWidth.substring(0, newWidth.indexOf("%")));
      return {
        ...state,
        imgWidth: width <= 80 && width >= 30 ? action.payload : state.imgWidth,
      };
    }
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
  imgWidth: "80%",
};
