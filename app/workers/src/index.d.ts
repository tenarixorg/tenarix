import { Parser, GetContent, Folder } from "types";
import { Readable } from "stream";

declare const content: GetContent;

declare const parser: Parser;

declare const getHash: (data: string) => Promise<string>;

declare const decrypt: (password: string, inputPath: string) => Buffer;

declare const encrypt: (
  password: string,
  outputPath: string,
  input: Readable
) => Promise<boolean>;

declare const getImg: (
  url: string,
  headers?: Record<string, string>
) => Promise<Buffer>;

declare const init: (basePath: string, folders: Folder[]) => void;

declare const loadFile: <T>(
  path: string,
  type: T extends object ? "object" : "string"
) => Promise<T extends object ? T : string>;
