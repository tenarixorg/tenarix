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

export interface Read {
  id: string;
  title: string;
  info: string;
  pages: number;
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
  trending: HomeBase[];
  latest: HomeBase[];
  updates: HomeBase2[];
}
