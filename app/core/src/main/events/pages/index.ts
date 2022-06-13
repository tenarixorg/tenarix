import { mergeEventStacks } from "../../handler";
import extensions from "./extensions";
import library from "./library";
import details from "./details";
import home from "./home";
import read from "./read";

export default mergeEventStacks(extensions, library, details, home, read);
