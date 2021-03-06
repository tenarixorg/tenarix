import { getCache, setCache, hasCache } from "../../store";
import { EventStack } from "../../handler";

const events = new EventStack();

events.push("get:home", async ({ extensionID, extension, chromiumExec }, e) => {
  try {
    if (hasCache(extensionID, "home")) {
      e.reply("res:home", getCache(extensionID, "home"));
    } else {
      const res = await extension?.home(chromiumExec);
      setCache(extensionID, "home", res);
      e.reply("res:home", res);
    }
  } catch (error: any) {
    e.reply("res:error", { error: error.message });
  }
});

export default events;
