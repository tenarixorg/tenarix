import { load } from "cheerio";
import { IpcMainEvent, BrowserWindow } from "electron";
import { Page as BPage } from "puppeteer";
import axios from "axios";

export interface ChapterInfo {
  src: string;
  id: string;
}

export interface PageBase {
  img: string;
  title: string;
  type: string;
  route: string;
}

export interface Chapter {
  title: string;
  links: ChapterInfo[];
}

export interface Details {
  title: string;
  description: string;
  status: string;
  img: string;
  type: string;
  genres: string[];
  chapters: Chapter[];
}

export interface Library {
  items: PageBase[];
}

export interface Filters {
  title?: string;
}

export interface Page {
  img: string;
}

interface Img {
  url: string;
  page: number;
}

export interface Read {
  id: string;
  title: string;
  info: string;
  pages: number;
  imgs: Img[];
}

export interface Home {
  popular: PageBase[];
}

export interface AppContent {
  name: string;
  lang: string;
  home: (execPath: string) => Promise<Home>;
  details: (route: string, execPath: string) => Promise<Details>;
  library: (
    page: string,
    execPath: string,
    filters?: Filters
  ) => Promise<Library>;
  read: (id: string, execPath: string) => Promise<Read>;
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

export type GetContent = (
  url: string,
  execPath: string,
  opts?: Opts
) => Promise<Content>;

export type Parser = typeof load;

export type Http = typeof axios;

export type Extension = (
  content: GetContent,
  parser: Parser,
  http: Http
) => AppContent;

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
          sub_text: string;
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
  reverse: boolean;
  ids: string[];
  sources: { chapter: string; id: string }[];
  percentages: ReadPercentage[];
}

export interface DetailsAction {
  type:
    | "setData"
    | "setIds"
    | "setPercentages"
    | "reverseChapter"
    | "setDowns"
    | "setSources"
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
    | "reset"
    | "setData"
    | "setImg"
    | "setCurrent"
    | "incrementCurrent"
    | "decrementCurrent"
    | "setLoading"
    | "setLoading2"
    | "setRemote"
    | "setCascade"
    | "toggleCascade"
    | "setLocalImgs"
    | "setImgWidth"
    | "setIds"
    | "setReverse"
    | "setChapterIndex";
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
  ids: string[];
  reverse: boolean;
  chapterIndex: number;
}

export interface AppearanceAction {
  type:
    | "setShowFileCard"
    | "toggleShowFileCard"
    | "setLoading"
    | "setCurrent"
    | "setFilename"
    | "setValues"
    | "setOptions"
    | "setNewColors"
    | "setPrimary"
    | "setBackground1"
    | "setBackground2"
    | "setNavBackground"
    | "setNavBtnsColors"
    | "setFontPrimary"
    | "setFontSecondary"
    | "setSecondary";
  payload?: any;
}

export interface AppearanceState {
  showFileCard: boolean;
  current: string;
  loading: boolean;
  filename: string;
  values: SelectItem[];
  options: SelectItem[];
  newColors: BaseTheme;
}

export interface DownloadItem {
  title: string;
  info: string;
  pages: number;
  id: string;
  rid: string;
}

export interface DownloadStore {
  data: DownloadItem;
  done: boolean;
  inProgress: boolean;
}

export interface SettingsStore {
  lang: string;
  theme: {
    schema: "dark" | "light";
    file: string;
  };
}

export interface ReadPercentageStore {
  percentage: number;
  lastPage: number;
}

export interface ReadPercentage {
  id: string;
  percetage: number;
}

export interface Folder {
  name: string;
  files?: {
    name: string;
    content: string;
  }[];
}

export type OmitLangID = Omit<Language, "id">;

export type OmitExtID = Omit<AppContent, "id">;

export interface AppLangs {
  [id: string]: OmitLangID;
}

export interface AppExts {
  [id: string]: OmitExtID;
}

export interface AppHandler {
  languageID: string;
  extensionID: string;
  extension: OmitExtID | undefined;
  language: OmitLangID | undefined;
  currentDowns: number;
  lastRoute: string;
  customTheme: Theme;
  currentThemeSchema: "dark" | "light";
  win: BrowserWindow;
  chromium: ChromiumMeta;
  chromiumExec: string;
  appFolder: string;
  themeFolder: string;
  settingsPath: string;
  downloadFolder: string;
  extensionsFolder: string;
  extensions: AppExts;
  languages: AppLangs;
  maxDownloads: number;
}

export type EventCallback = (
  handler: AppHandler,
  event: IpcMainEvent,
  ...args: any[]
) => void;

export interface EventItem {
  event: string;
  callback: EventCallback;
}

export interface ChromiumMeta {
  url: string;
  folder: string;
  exec: string;
}
