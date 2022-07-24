import fs from "fs";
import Ajv from "ajv";
import { settingsSchema, themeSchema } from "schemas";
import { getSettings, setSettings } from "../store";
import { SettingsStore, Theme } from "types";
import { loadLocalFile } from "../helper";
import { resolve, join } from "path";
import { format_ext } from "utils";
import { EventStack } from "../handler";

const events = new EventStack();

events.push("get:theme", async (h, e) => {
  const file = getSettings()?.theme.file || "basic.json";
  const schema = getSettings()?.theme.schema || h.currentThemeSchema;
  try {
    const theme_ = await loadLocalFile<Theme>(
      resolve(h.themeFolder + "/" + file),
      "object"
    );
    h.customTheme = theme_;
    e.reply("change:theme", h.customTheme[schema]);
  } catch (error) {
    e.reply("change:theme", h.customTheme[schema]);
  }
});

events.push("get:theme:schema", ({ currentThemeSchema }, e) => {
  const file = getSettings()?.theme.file || "basic.json";
  const schema = getSettings()?.theme.schema || currentThemeSchema;
  const res = {
    schema,
    themeName: {
      label: format_ext(file.replace(/\.json/gi, "")),
      value: file,
    },
  };

  e.reply("res:theme:schema", res);
});

events.push("change:theme:schema", async (h, e, { schema }) => {
  h.currentThemeSchema = schema;
  setSettings({
    lang: getSettings()?.lang || h.languageID,
    theme: {
      schema: h.currentThemeSchema || getSettings()?.theme.schema,
      file: getSettings()?.theme.file || "basic.json",
    },
  });
  const file = getSettings()?.theme.file || "basic.json";
  e.reply("change:theme", h.customTheme[h.currentThemeSchema]);
  try {
    const theme_ = await loadLocalFile<Theme>(
      resolve(h.themeFolder + "/" + file),
      "object"
    );
    h.customTheme = theme_;
    e.reply("change:theme", h.customTheme[h.currentThemeSchema]);
  } catch (error) {
    e.reply("change:theme", h.customTheme[h.currentThemeSchema]);
  }
  e.reply("res:theme:schema", {
    schema,
    themeName: {
      label: format_ext(file.replace(/\.json/gi, "")),
      value: file,
    },
  });
});

events.push("get:external:themes", async ({ themeFolder }, e) => {
  const files = fs.readdirSync(themeFolder);
  const res: { label: string; value: string }[] = [];
  for (const file of files) {
    res.push({
      label: format_ext(file.replace(/\.json/gi, "")),
      value: file,
    });
  }
  e.reply("res:external:themes", res);
});

events.push("get:external:themes:files", async ({ themeFolder }, e) => {
  const files = fs.readdirSync(themeFolder);
  e.reply("res:external:themes:files", files);
});

events.push("set:external:theme", async (h, e, { file }) => {
  const basePath = resolve(h.themeFolder + "/" + file);
  try {
    const newTheme = await loadLocalFile<Theme>(basePath, "object");
    h.customTheme = newTheme;
  } catch (err: any) {
    e.reply("res:error", { error: err.message });
  }
  setSettings({
    lang: getSettings()?.lang || h.languageID,
    theme: {
      schema: getSettings()?.theme.schema || h.currentThemeSchema,
      file,
    },
  });
  const file_ = getSettings()?.theme.file || "basic.json";
  const schema = getSettings()?.theme.schema || h.currentThemeSchema;
  e.reply("change:theme", h.customTheme[schema]);
  e.reply("res:theme:schema", {
    schema,
    themeName: {
      label: format_ext(file_.replace(/\.json/gi, "")),
      value: file_,
    },
  });
});

events.push("save:external:theme", (h, e, { filename, data, schema }) => {
  const basePath = h.themeFolder;
  const file = fs.createWriteStream(resolve(basePath + "/" + filename));
  file.write(
    JSON.stringify({ ...h.customTheme, [schema]: data }, null, "\t"),
    (err) => {
      file.close();
      if (err) {
        e.reply("res:error", { error: err.message });
      } else {
        h.currentThemeSchema = schema;
        h.customTheme[h.currentThemeSchema] = data;
        setSettings({
          lang: getSettings()?.lang || h.languageID,
          theme: {
            file: filename,
            schema: h.currentThemeSchema,
          },
        });
        e.reply("change:theme", h.customTheme[h.currentThemeSchema]);
        e.reply("res:theme:schema", {
          schema,
          themeName: {
            label: format_ext(filename.replace(/\.json/gi, "")),
            value: filename,
          },
        });
        const files = fs.readdirSync(basePath);
        const res: { label: string; value: string }[] = [];
        for (const file of files) {
          res.push({
            label: format_ext(file.replace(/\.json/gi, "")),
            value: file,
          });
        }
        e.reply("res:external:themes", res);
      }
    }
  );
});

events.push("save:full:settings", async (h, e, { data }) => {
  const base_ = JSON.parse(data) as { app: SettingsStore };
  const files = fs.readdirSync(h.themeFolder);
  const ajv = new Ajv();
  const validator = ajv.compile(settingsSchema(files));
  const valid = validator(base_);
  if (valid) {
    setSettings(base_.app);
    e.reply(
      "res:lang",
      h.languages[getSettings()?.lang || h.languageID] || h.language
    );
    const file_ = getSettings()?.theme.file || "basic.json";
    const schema = getSettings()?.theme.schema || h.currentThemeSchema;
    const theme_ = await loadLocalFile<Theme>(
      resolve(h.themeFolder + "/" + file_),
      "object"
    );
    h.customTheme = theme_;
    e.reply("change:theme", h.customTheme[schema]);
    e.reply("res:theme:schema", {
      schema,
      themeName: {
        label: format_ext(file_.replace(/\.json/gi, "")),
        value: file_,
      },
    });
  } else {
    e.reply("res:error", { error: ajv.errorsText(validator.errors) });
  }
});

events.push("save:full:external:theme", (h, e, { filename, data }) => {
  try {
    const base_ = JSON.parse(data) as Theme;
    const ajv = new Ajv();
    const validator = ajv.compile(themeSchema);
    const valid = validator(base_);
    if (!valid) {
      e.reply("res:error", { error: ajv.errorsText(validator.errors) });
    } else {
      const basePath = h.themeFolder;
      const file = fs.createWriteStream(resolve(join(basePath, filename)));
      file.write(data, (err) => {
        file.close();
        if (err) {
          e.reply("res:error", { error: err.message });
        } else {
          e.reply("res:error", { error: "Theme saved" });
          h.customTheme = base_;
          setSettings({
            lang: getSettings()?.lang || h.languageID,
            theme: {
              file: filename,
              schema: h.currentThemeSchema,
            },
          });
          e.reply("change:theme", h.customTheme[h.currentThemeSchema]);
        }
      });
    }
  } catch (err: any) {
    e.reply("res:error", { error: err.message });
  }
});

events.push("get:lang", ({ languageID, language, languages }, e) => {
  e.reply("res:lang:id", getSettings()?.lang || languageID);
  e.reply("res:lang", languages[getSettings()?.lang || languageID] || language);
});

events.push("change:lang", (h, e, { id }) => {
  h.languageID = id;
  h.language = h.languages[id];
  setSettings({
    lang: h.languageID,
    theme: {
      file: getSettings()?.theme.file || "basic.json",
      schema: getSettings()?.theme.schema || h.currentThemeSchema,
    },
  });
  e.reply("res:lang", h.language);
});

events.push("get:all:lang", ({ languages }, e) => {
  const keys = Object.keys(languages);
  const res = keys.map((curr) => ({ id: curr, name: languages[curr].name }));
  e.reply("res:all:lang", res);
});

events.push(
  "load:editor",
  async ({ themeFolder, settingsPath }, e, { src, data }) => {
    if (src === "theme") {
      const themePath = resolve(join(themeFolder, data.filename));
      const res = await loadLocalFile(themePath, "string");
      e.reply("res:load:editor", res);
    } else if (src === "setup") {
      const res = await loadLocalFile(settingsPath, "string");
      e.reply("res:load:editor", res);
    }
  }
);

events.push("set:last:route", (h, _e, { route }) => {
  h.lastRoute = route;
});

events.push("get:last:route", ({ lastRoute }, e) => {
  e.reply("res:last:route", lastRoute);
});

events.push("set:internet:mode", (h, _e, { mode }) => {
  h.offline = !mode;
});

export default events;
