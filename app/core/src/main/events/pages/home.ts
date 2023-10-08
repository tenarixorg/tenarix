import { getCache, setCache, hasCache } from "../../store";
import { EventStack } from "../../handler";

const events = new EventStack();

events.push(
  "get:home",
  async ({ extensionID, extension, chromium, internet }, e) => {
    try {
      if (hasCache(extensionID, "home")) {
        e.reply("res:home", getCache(extensionID, "home"));
      } else {
        if (!internet) {
          e.reply("res:home", null);
          return;
        }
        const res = await extension?.home(chromium.exec);
        setCache(extensionID, "home", res);
        e.reply("res:home", res);
      }
    } catch (error: any) {
      e.reply("res:error", { error: error.message });
    }
  }
);

export default events;
