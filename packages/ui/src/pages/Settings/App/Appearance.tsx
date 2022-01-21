import React, { useState, useEffect, useRef } from "react";
import { useLang, useTheme } from "context-providers";
import { Container } from "components/src/Elements";

const { api } = window.bridge;

export const Appearance: React.FC = () => {
  const mounted = useRef(false);
  const [current, setCurrent] = useState("dark");
  const { colors } = useTheme();
  const { lang } = useLang();

  useEffect(() => {
    mounted.current = true;
    api.on("res:toggle:theme", (_e, res) => {
      if (mounted.current) setCurrent(res);
    });
    return () => {
      api.removeAllListeners("res:toggle:theme");
      mounted.current = false;
    };
  }, []);
  return (
    <Container bg={colors.background2} scrollColor={colors.primary}>
      <p style={{ color: colors.fontSecondary, fontSize: 18 }}>
        {lang.settings.options_1.appearance.content.head_text}
      </p>
      <p style={{ color: colors.fontSecondary }}>{current}</p>
      <button
        onClick={() => {
          api.send("toggle:theme");
        }}
      >
        {lang.settings.options_1.appearance.content.btn_text}
      </button>
    </Container>
  );
};
