import React from "react";
import { Navbar } from "components";
import { Base } from "base";
const { api } = window.bridge;

export const App: React.FC = () => {
  return (
    <div>
      <Navbar
        back={() => {
          window.history.back();
        }}
        home={() => {
          window.location.href = "#/";
        }}
        forward={() => {
          window.history.forward();
        }}
        close={() => {
          api.send("closeApp");
        }}
        maximize={() => {
          api.send("maximizeApp");
        }}
        minimize={() => {
          api.send("minimizeApp");
        }}
      />
      <main style={{ marginTop: 30 }}>
        <Base />
      </main>
    </div>
  );
};
