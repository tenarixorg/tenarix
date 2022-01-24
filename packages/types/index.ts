import { load } from "cheerio";
import { Page as BPage } from "puppeteer";

export interface ChapterInfo {
  src: string;
  id: string;
}

export interface Chapter {
  title: string;
  links: ChapterInfo[];
}

export interface Details {
  title: string;
  subtitle: string;
  description: string;
  status: string;
  img: string;
  type: string;
  score: string;
  demography: string;
  genders: string[];
  chapters: Chapter[];
}

export interface LibItem {
  img: string;
  title: string;
  score: string;
  type: string;
  demography: string;
  route: string;
}

export interface Library {
  items: LibItem[];
}

export interface Filters {
  title?: string;
  filterBy?: string;
  type?: string;
  demography?: string;
  status?: string;
  translationStatus?: string;
  webcomic?: string;
  yonkoma?: string;
  amateur?: string;
  erotic?: string;
}

export interface Page {
  img: string;
}

interface Img {
  url: string;
  page: number;
  free: boolean;
}

export interface Read {
  id: string;
  title: string;
  info: string;
  pages: number;
  imgs: Img[];
}

export interface HomeBase {
  img: string;
  title: string;
  score: string;
  type: string;
  demography: string;
  route: string;
}

export interface HomeBase2 {
  img: string;
  title: string;
  type: string;
  route: string;
  chapter: string;
}

export interface Home {
  popular: HomeBase[];
}

export interface AppContent {
  name: string;
  lang: string;
  home: () => Promise<Home>;
  details: (route: string) => Promise<Details>;
  library: (page: string, filters: Filters) => Promise<Library>;
  read: (id: string) => Promise<Read>;
  opts?: {
    headers: Record<string, string>;
    refererRule?: (r: string) => string;
  };
}

export interface Content {
  innerHTML: string;
  current_url: string;
}

export interface Opts {
  action?: (page: BPage) => Promise<void>;
  scripts?: boolean;
  imgs?: boolean;
  headers?: Record<string, string>;
}

export type GetContent = (url: string, opts?: Opts) => Promise<Content>;

export type Parser = typeof load;

export type Extension = (content: GetContent, parser: Parser) => AppContent;

export interface Lang {
  id: string;
  name: string;
}

export interface Source {
  ext: string;
  pinned: boolean;
  lang: string;
}

export interface FavHome {
  route: string;
  ext: string;
  data: Details;
}

export interface BaseTheme {
  primary: string;
  secondary: string;
  background1: string;
  background2: string;
  fontPrimary: string;
  fontSecondary: string;
  navbar: {
    background: string;
    buttons: {
      background: string;
      color: string;
      hover: string;
    };
  };
  buttons: {
    background: string;
    hover: string;
    color: string;
    border: string;
  };
}

export interface Theme {
  dark: BaseTheme;
  light: BaseTheme;
}

export interface Language {
  id: string;
  name: string;
  home: {
    head: string;
  };
  library: {
    head: string;
  };
  favorites: {
    head: string;
  };
  extensions: {
    pin_option_text: string;
    search_placeholder: string;
    select_title: string;
  };
  details: {
    genders: string;
    status: string;
    chapters: string;
  };
  settings: {
    options_1: {
      head: string;
      appearance: {
        option_text: string;
        content: {
          head_text: string;
          sub_text1: string;
          radios: {
            text1: string;
            text2: string;
          };
          sub_text2: string;
          btn_text1: string;
          btn_text2: string;
        };
      };
      advanced: {
        option_text: string;
      };
      language: {
        option_text: string;
        content: {
          head_text: string;
        };
      };
    };
  };
}

export interface DetailsState {
  data: Details;
  downs: DownloadStore[];
  order: boolean;
  show: boolean;
  loading: boolean;
  fav: boolean;
}

export interface DetailsAction {
  type:
    | "setData"
    | "reverseChapter"
    | "setDowns"
    | "toggleOrder"
    | "toggleShow"
    | "setLoading"
    | "setFav";
  payload?: any;
}

export interface ExtensionsState {
  sources: Source[];
  pinnedOnly: boolean;
  loading: boolean;
  query: string;
  langs: Lang[];
  slangs: SelectItem[];
}

export interface SelectItem {
  value: string;
  label: string;
}

export interface ExtensionsAction {
  type:
    | "setSources"
    | "setLangs"
    | "setSlangs"
    | "setLoading"
    | "setPinnedOnly"
    | "setQuery";
  payload?: any;
}

export interface FavoritesState {
  favs: FavHome[];
  loading: boolean;
}

export interface FavoritesAction {
  type: "setFavs" | "setLoading";
  payload?: any;
}

export interface HomeState {
  loading: boolean;
  data: Home;
}

export interface HomeAction {
  type: "setData" | "setLoading";
  payload?: any;
}

export interface LibraryState {
  loading: boolean;
  data: Library["items"];
  page: number;
}

export interface LibraryAction {
  type:
    | "setData"
    | "setLoading"
    | "setPage"
    | "incrementPage"
    | "decrementPage";
  payload?: any;
}

export interface ReadAction {
  type:
    | "setData"
    | "setImg"
    | "setCurrent"
    | "incrementCurrent"
    | "decrementCurrent"
    | "setLoading"
    | "setLoading2"
    | "setRemote"
    | "setCascade"
    | "setLocalImgs"
    | "setImgWidth";
  payload?: any;
}

export interface ReadState {
  data: Read;
  img: string;
  current: number;
  loading: boolean;
  loading2: boolean;
  remote: boolean;
  cascade: boolean;
  imgWidth: string;
  localImgs: string[];
}

export interface DownloadStore {
  data: { title: string; info: string; pages: number; id: string; rid: string };
  done: boolean;
  inProgress: boolean;
}

export interface SettingsStore {
  theme: "dark" | "light";
  lang: string;
  colors: Theme;
}
