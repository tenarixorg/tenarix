import { resolve, join } from "path";
import { initFolders } from "../helper";

export class FolderHandler {
  public readonly appFolder: string;
  public readonly themeFolder: string;
  public readonly settingsPath: string;
  public readonly downloadFolder: string;
  public readonly extensionsFolder: string;
  public readonly languagesFolder: string;

  constructor(home: string) {
    this.appFolder = resolve(join(home, ".tenarix"));
    this.themeFolder = resolve(join(this.appFolder, "themes"));
    this.settingsPath = resolve(
      join(this.appFolder, "config", "settings.json")
    );
    this.downloadFolder = resolve(join(this.appFolder, ".dreader"));
    this.extensionsFolder = resolve(join(this.appFolder, "extensions"));
    this.languagesFolder = resolve(join(this.appFolder, "languages"));
  }

  public async initFolders(
    baseFolder: string,
    langId: string,
    themeSchema: string
  ) {
    await initFolders(baseFolder, [
      { name: ".dreader" },
      { name: "extensions" },
      {
        name: "themes",
        files: [
          {
            name: "basic.json",
            content: JSON.stringify(themeSchema, null, "\t"),
          },
        ],
      },
      {
        name: "config",
        files: [
          {
            name: "settings.json",
            content: JSON.stringify(
              {
                app: {
                  lang: langId,
                  theme: {
                    schema: themeSchema,
                    file: "basic.json",
                  },
                },
              },
              null,
              "\t"
            ),
          },
        ],
      },
    ]);
  }
}
