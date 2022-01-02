import { load } from "cheerio";
import { Page as BPage } from "puppeteer";
import { OutgoingHttpHeaders } from "http";

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
    headers: OutgoingHttpHeaders;
  };
}

export interface Content {
  innerHTML: string;
  current_url: string;
}

export interface Opts {
  action?: (page: BPage) => Promise<void>;
  scripts?: boolean;
}

export type GetContent = (url: string, opts?: Opts) => Promise<Content>;

export type Parser = typeof load;

export type Extension = (content: GetContent, parser: Parser) => AppContent;
