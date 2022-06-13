import { getCache, setCache, hasCache } from "../../store";
import { EventStack } from "../../handler";

const events = new EventStack();

events.push(
  "get:library",
  async ({ extensionID, chromiumExec, extension }, e, { page, filters }) => {
    const key =
      "library" + page + JSON.stringify(filters).replace(/({|}|,|"|:)/g, "");
    try {
      if (hasCache(extensionID, key)) {
        e.reply("res:library", getCache(extensionID, key));
      } else {
        const res = await extension?.library(page, chromiumExec, filters);
        setCache(extensionID, key, res?.items);
        e.reply("res:library", res?.items);
      }
    } catch (error: any) {
      e.reply("res:error", { msg: error.message });
    }
  }
);

export default events;
