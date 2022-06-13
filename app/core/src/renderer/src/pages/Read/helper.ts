import { ReadAction, ReadState } from "types";
import { NavigateFunction } from "react-router-dom";

export const nextChapter = (
  rever: boolean,
  curr: number,
  chapIdx: number,
  pages: number,
  ids_: string[],
  ext_: string,
  route: string,
  navigation: NavigateFunction,
  reset: () => void,
  casc?: boolean,
  cascadeDir?: "left" | "right"
) => {
  const op = rever ? -1 : 1;

  if (casc && cascadeDir) {
    const dir = cascadeDir === "left" ? -1 : 1;
    const cond = !!ids_[chapIdx + dir * op];
    if (chapIdx >= 0 && cond) {
      reset();
      navigation(`/read/${route}/${ids_[chapIdx + dir * op]}`, {
        state: {
          ext: ext_,
          chapters: ids_,
          reverse: rever,
          cascade: casc,
        },
        replace: true,
      });
    }
  } else if (curr < 1) {
    const cond = !!ids_[chapIdx - op];
    if (chapIdx >= 0 && cond) {
      reset();
      navigation(`/read/${route}/${ids_[chapIdx - op]}`, {
        state: {
          ext: ext_,
          chapters: ids_,
          reverse: rever,
          cascade: casc,
        },
        replace: true,
      });
    }
  } else if (curr > pages && pages !== 0) {
    const cond = !!ids_[chapIdx + op];
    if (chapIdx >= 0 && cond) {
      reset();
      navigation(`/read/${route}/${ids_[chapIdx + op]}`, {
        state: {
          ext: ext_,
          chapters: ids_,
          reverse: rever,
          cascade: false,
        },
        replace: true,
      });
    }
  }
};

export const initialState: ReadState = {
  data: { id: "", imgs: [], info: "", pages: 0, title: "" },
  cascade: false,
  current: 1,
  img: "",
  ids: [],
  loading: true,
  reverse: true,
  loading2: true,
  localImgs: [],
  remote: false,
  imgWidth: "80%",
  chapterIndex: 0,
};

export const reducer = (state: ReadState, action: ReadAction): ReadState => {
  switch (action.type) {
    case "reset":
      return initialState;
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
    case "toggleCascade":
      return { ...state, cascade: !state.cascade };
    case "setCascade":
      return { ...state, cascade: action.payload };
    case "setCurrent":
      return { ...state, current: action.payload };
    case "setReverse":
      return { ...state, reverse: action.payload };
    case "setChapterIndex":
      return { ...state, chapterIndex: action.payload };
    case "setIds":
      return { ...state, ids: action.payload };
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
