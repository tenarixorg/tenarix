import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
