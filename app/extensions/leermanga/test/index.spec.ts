import extension from "../src";
import { parser, content } from "workers";

const base = extension(content, parser);

describe("Extension", () => {
  test("should be a valid extension", () => {
    expect(base.home).toBeInstanceOf(Function);
    expect(base.read).toBeInstanceOf(Function);
    expect(base.details).toBeInstanceOf(Function);
    expect(base.library).toBeInstanceOf(Function);
    expect(base.name).toBeDefined();
  });
});
