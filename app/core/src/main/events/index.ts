import { EventStack } from "../handler";
import config from "./config";
import pages from "./pages";
import init from "./init";

export default EventStack.mergeStacks(init, config, pages);
