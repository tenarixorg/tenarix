import { FavoritesAction, FavoritesState } from "types";

export const initialState: FavoritesState = {
  favs: [],
  loading: true,
};

export const reducer = (
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState => {
  switch (action.type) {
    case "setFavs":
      return { ...state, favs: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};
