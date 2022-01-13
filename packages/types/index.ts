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
  headers?: Record<string, string>;
}

export type GetContent = (url: string, opts?: Opts) => Promise<Content>;

export type Parser = typeof load;

export type Extension = (content: GetContent, parser: Parser) => AppContent;

export interface Source {
  ext: string;
  pinned: boolean;
}

export interface FavHome {
  route: string;
  ext: string;
  data: Details;
}

export interface Language {
  id: string;
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
          btn_text: string;
          head_text: string;
        };
      };
      advanced: {
        option_text: string;
      };
    };
  };
}
