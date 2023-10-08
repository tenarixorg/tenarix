import { EventStack } from "../../handler";
import extensions from "./extensions";
import library from "./library";
import details from "./details";
import plugins from "./plugins";
import home from "./home";
import read from "./read";

export default EventStack.mergeStacks(
  extensions,
  library,
  details,
  plugins,
  home,
  read
);
