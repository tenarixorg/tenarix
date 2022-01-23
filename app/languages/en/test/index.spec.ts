import lang from "../src";

describe("Language: en-EN", () => {
  test("should be a valid language", () => {
    expect(lang.home.head.length).toBeGreaterThan(1);
    expect(lang.library.head.length).toBeGreaterThan(1);
    expect(lang.favorites.head.length).toBeGreaterThan(1);
    expect(lang.details.chapters.length).toBeGreaterThan(1);
    expect(lang.details.genders.length).toBeGreaterThan(1);
    expect(lang.details.status.length).toBeGreaterThan(1);
    expect(lang.extensions.pin_option_text.length).toBeGreaterThan(1);
    expect(lang.extensions.search_placeholder.length).toBeGreaterThan(1);
    expect(lang.extensions.select_title.length).toBeGreaterThan(1);
    expect(lang.settings.options_1.head.length).toBeGreaterThan(1);
    expect(
      lang.settings.options_1.appearance.content.btn_text.length
    ).toBeGreaterThan(1);
    expect(
      lang.settings.options_1.appearance.content.head_text.length
    ).toBeGreaterThan(1);
    expect(
      lang.settings.options_1.appearance.option_text.length
    ).toBeGreaterThan(1);
    expect(
      lang.settings.options_1.language.content.head_text.length
    ).toBeGreaterThan(1);
    expect(lang.settings.options_1.language.option_text.length).toBeGreaterThan(
      1
    );
    expect(lang.settings.options_1.advanced.option_text.length).toBeGreaterThan(
      1
    );
    expect(lang.id.length).toBeGreaterThan(1);
    expect(lang.name.length).toBeGreaterThan(1);
  });
});
