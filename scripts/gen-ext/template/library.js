export const library = `import { Filters, GetContent, Library, Parser } from "types";\n
const libraryParams = (page: string, filters?: Filters) => {
  return "https://baseurl?doSearch&&usingPage&&filters";
};

export const _library = (content: GetContent, parser: Parser) => {
  return async (page: string, filters?: Filters): Promise<Library> => {
    const { innerHTML } = await content(libraryParams(page, filters));
    const $ = parser(innerHTML);
    return {
      items: [],
    };
  };
};
`;
