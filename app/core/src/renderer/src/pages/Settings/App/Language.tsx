import React, { useState, useEffect, useRef } from "react";
import { useLang, useTheme } from "context-providers";
import { Container } from "components/src/Elements";
import styled from "styled-components";

const { api } = window.bridge;

export const Language: React.FC = () => {
  const mounted = useRef(false);
  const [current, setCurrent] = useState("");
  const [langs, setLangs] = useState<{ name: string; id: string }[]>([]);
  const { colors } = useTheme();
  const { lang } = useLang();

  useEffect(() => {
    mounted.current = true;
    api.on("res:lang:id", (_e, res) => {
      if (mounted.current) setCurrent(res);
    });
    api.on("res:all:lang", (_e, res) => {
      if (mounted.current) setLangs(res);
    });
    api.send("get:lang");
    api.send("get:all:lang");
    return () => {
      api.removeAllListeners("res:lang:id");
      api.removeAllListeners("res:all:lang");
      mounted.current = false;
    };
  }, []);

  return (
    <Container
      bg={colors.background2}
      scrollColor={colors.primary}
      padding="0px 0px 40px 0px"
    >
      <div style={{ width: "60vw", margin: "10px 0px 0px -4%" }}>
        <p style={{ color: colors.fontSecondary, fontSize: 18 }}>
          {lang.settings.options_1.language.content.head_text}
        </p>
      </div>

      <LanguageTogleContainer>
        <div style={{ width: "61vw", margin: "10px 0px" }}>
          <Label fs="16" bold color={colors.fontPrimary}>
            {lang.settings.options_1.language.content.sub_text}
          </Label>
        </div>
        {langs.map((el, i) => (
          <RadioContainer
            key={i}
            bg={colors.background1}
            onClick={() => {
              if (current !== el.id) {
                setCurrent(el.id);
                api.send("change:lang", { id: el.id });
              }
            }}
          >
            <RadioOpt
              color={colors.primary}
              bg={colors.navbar.background}
              type="radio"
              id="opt1"
              name="lang"
              value={el.id}
              onChange={(e) => {
                if (current !== el.id) {
                  setCurrent(e.target.value);
                  api.send("change:lang", { id: e.target.value });
                }
              }}
              checked={current === el.id}
            />
            <Label
              color={colors.fontPrimary}
              fs="14px"
              bold
              margin="0px 10px"
              htmlFor="opt1"
            >
              {el.name}
            </Label>
          </RadioContainer>
        ))}
      </LanguageTogleContainer>
    </Container>
  );
};

const RadioOpt = styled.input<{ bg: string; color: string }>`
  pointer-events: none;
  position: relative;
  border: 1px solid black;
  outline: none;
  appearance: none;
  background-color: ${(p) => p.bg};
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  &::after {
    position: absolute;
    content: "";
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  &:checked {
    &::after {
      background-color: ${(p) => p.color};
    }
  }
`;

const Label = styled.label<{
  color: string;
  fs: string;
  bold?: boolean;
  margin?: string;
}>`
  cursor: pointer;
  color: ${(p) => p.color};
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "bold" : "normal")};
  margin: ${(p) => p.margin || "0px"};
  pointer-events: none;
`;

const RadioContainer = styled.div<{ bg: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0px;
  cursor: pointer;
  background-color: ${(p) => p.bg};
  padding: 5px 0px 5px 10px;
  border-radius: 4px;
  box-shadow: 4px 4px 9px -5px #000000;
  width: 60vw;
  transition: transform 500ms ease-in-out;
  &:hover {
    transform: translate3D(-1px, -1px, 0px);
  }
`;

const LanguageTogleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 30px 0px 10px 0px;
`;
