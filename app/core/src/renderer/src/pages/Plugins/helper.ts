import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { PluginsAction, PluginsState } from "types";

export const initialState: PluginsState = {
  query: "",
  plugins: [],
  selectedPlugin: null,
  installed: [],
  clear: false,
  showModal: false,
};

export const reducer = (
  state: PluginsState,
  action: PluginsAction
): PluginsState => {
  switch (action.type) {
    case "setQuery":
      return { ...state, query: action.payload };
    case "setPlugins":
      return { ...state, plugins: action.payload };
    case "setSelectedPlugin":
      return { ...state, selectedPlugin: action.payload };
    case "setInstalled":
      return { ...state, installed: action.payload };
    case "setClear":
      return { ...state, clear: action.payload };
    case "setShowModal":
      return { ...state, showModal: action.payload };
    default:
      return state;
  }
};

export const Markdown = styled(ReactMarkdown)<{
  color: string;
}>`
  color: ${(props) => props.color};
`;
