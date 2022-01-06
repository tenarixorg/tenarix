import React, { useState, useEffect } from "react";
import { useTheme } from "context-providers";
const { api } = window.bridge;

export const Appearance: React.FC = () => {
  const [current, setCurrent] = useState("dark");
  const { colors } = useTheme();

  useEffect(() => {
    api.on("res:toggle:theme", (_e, res) => {
      setCurrent(res);
    });
  }, []);
  return (
    <div>
      <p style={{ color: colors.fontSecondary }}>{current}</p>
      <button
        onClick={() => {
          api.send("toggle:theme");
        }}
      >
        Toggle theme
      </button>
    </div>
  );
};
