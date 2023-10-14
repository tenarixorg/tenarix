import {
  getAllExt,
  format_ext,
  capitalize,
  decodeRoute,
  encodeRoute,
  sourcesFilter,
  matchSystemLang,
  toastMessageFormat,
  langs2SelectOptions,
} from "../src";

describe("Util Functions", () => {
  test("should encode and decode route", () => {
    const route = "egssh/shdd/sks?sdjd=122";
    const enc = encodeRoute("egssh/shdd/sks?sdjd=122");
    const dec = decodeRoute(enc);
    expect(dec).toEqual(route);
  });
  test("should Capitalize", () => {
    const temp = capitalize("testing");
    expect(temp).toEqual("Testing");
  });
  test("should format extension name", () => {
    const temp = format_ext("testing_this");
    expect(temp).toEqual("Testing This");
  });
  test("should format toast message", () => {
    const lessthan38 = "Lorem, ipsum dolor sit amet";
    const temp1 = toastMessageFormat(lessthan38);
    const temp2 = toastMessageFormat(lessthan38 + lessthan38);
    expect(temp1).toEqual(lessthan38);
    expect(temp2).toContain(lessthan38);
    expect(temp2).toContain("\n");
  });
  test("should get extensions", () => {
    const temp = {
      ext1: {
        lang: "en",
      },
      ext2: {
        lang: "es",
      },
    };
    const pinned = {
      ext1: true,
      ext2: false,
    };

    const temp2 = getAllExt(temp, (ext) => {
      return ext === "ext1" ? pinned.ext1 : pinned.ext2;
    });
    expect(temp2).toBeDefined();
    expect(temp2).toBeInstanceOf(Array);
    expect(temp2.length).toBeGreaterThan(0);
    expect(temp2[0].lang.length).toBeGreaterThan(0);
    expect(temp2[0].pinned).toEqual(true);
  });
  test("should match language", () => {
    const temp = matchSystemLang(["es", "en"], "es", "en");
    expect(temp).toEqual("es");
  });
  test("should transform languages 2 select options", () => {
    const temp = langs2SelectOptions([
      { id: "es", name: "Spanish" },
      { id: "en", name: "English" },
    ]);
    expect(temp).toBeDefined();
    expect(temp).toBeInstanceOf(Array);
    expect(temp.length).toBeGreaterThan(0);
    expect(temp[0].value.length).toBeGreaterThan(0);
    expect(temp[0].label.length).toBeGreaterThan(0);
  });
  test("should filter sources", () => {
    const temp = sourcesFilter(false, "manga", [
      { label: "Spanish", value: "es" },
    ]);
    expect(temp).toBeInstanceOf(Function);
    const res = temp({ ext: "manga", pinned: false, lang: "es" });
    expect(res).toBeDefined();
    expect(res?.ext.length).toBeGreaterThan(0);
    expect(res?.lang.length).toBeGreaterThan(0);
    expect(res?.pinned).toEqual(false);
  });
  test("should filter sources (Pinned only)", () => {
    const temp = sourcesFilter(true, "manga", [
      { label: "Spanish", value: "es" },
    ]);
    expect(temp).toBeInstanceOf(Function);
    const res = temp({ ext: "manga", pinned: true, lang: "es" });
    expect(res).toBeDefined();
    expect(res?.ext.length).toBeGreaterThan(0);
    expect(res?.lang.length).toBeGreaterThan(0);
    expect(res?.pinned).toEqual(true);
  });
  test("should filter sources (No selected langs)", () => {
    const temp = sourcesFilter(true, "manga", []);
    expect(temp).toBeInstanceOf(Function);
    const res = temp({ ext: "manga", pinned: true, lang: "es" });
    expect(res).toBeDefined();
    expect(res?.ext.length).toBeGreaterThan(0);
    expect(res?.lang.length).toBeGreaterThan(0);
    expect(res?.pinned).toEqual(true);
  });
});
