import { hasPinExt, removePinExt, setPinExt } from "../../store";
import { EventStack } from "../../handler";
import { getAllExt } from "utils";

const events = new EventStack();

events.push("get:exts", ({ extensions }, e) => {
  const res = getAllExt(extensions, hasPinExt);
  e.reply("res:exts", res);
});

events.push("add:pin:ext", ({ extensions }, e, { ext }) => {
  setPinExt(ext);
  const res = getAllExt(extensions, hasPinExt);
  e.reply("res:exts", res);
});

events.push("remove:pin:ext", ({ extensions }, e, { ext }) => {
  removePinExt(ext);
  const res = getAllExt(extensions, hasPinExt);
  e.reply("res:exts", res);
});

events.push("change:source", (handler, _e, { source }) => {
  handler.extension = handler.extensions[source];
  handler.extensionID = source;
});

export default events;
