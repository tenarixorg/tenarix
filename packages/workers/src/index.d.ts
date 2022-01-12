import { Parser, GetContent } from "types";
import { Readable } from "stream";

declare const content: GetContent;

declare const parser: Parser;

declare function getHash(data: string): Promise<string>;

declare function decrypt(password: string, inputPath: string): Buffer;

declare function encrypt(
  password: string,
  outputPath: string,
  input: Readable
): boolean;

declare function getImg(
  url: string,
  headers?: Record<string, string>
): Promise<Buffer>;
