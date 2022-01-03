export const read = `import { GetContent, Parser, Read } from "types";\n
export const _read = (content: GetContent, parser: Parser) => {
  return async (id: string): Promise<Read> => {
    const url = "https://baseurl/read/using/id";
    const { innerHTML } = await content(url);
    const $ = parser(innerHTML);
    return {
      id: "",
      title: "",
      info: "",
      pages: 0,
      imgs: [],
    };
  };
};
`;
