import { mergeEventStacks } from "../handler";
import config from "./config";
import pages from "./pages";
import init from "./init";

export default mergeEventStacks(init, config, pages);
