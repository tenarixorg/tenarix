import React, { useState, useEffect, useRef } from "react";
import { useLang, useTheme } from "context-providers";
import { ThemeDescriptor } from "components";
import { Container } from "components/src/Elements";
import styled from "styled-components";
import { BaseTheme } from "types";

const { api } = window.bridge;

export const Appearance: React.FC = () => {
  const mounted = useRef(false);
  const { colors } = useTheme();
  const { lang } = useLang();
  const [newColors, setNewColors] = useState<BaseTheme>(colors);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    api.on("res:theme:schema", (_e, res) => {
      if (mounted.current) setCurrent(res);
    });
    api.send("get:theme:schema");
    mounted.current = true;
    return () => {
      api.removeAllListeners("res:theme:schema");
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setNewColors(colors);
  }, [colors]);

  return (
    <Container
      bg={colors.background2}
      scrollColor={colors.primary}
      padding="0px 0px 30px 0px"
    >
      <div style={{ width: "60vw", margin: "10px 0px 0px -4%" }}>
        <p style={{ color: colors.fontSecondary, fontSize: 18 }}>
          {lang.settings.options_1.appearance.content.head_text}
        </p>
      </div>

      <ThemeTogleContainer>
        <div style={{ width: "61vw", margin: "5px 0px" }}>
          <Label fs="18" bold color={colors.fontPrimary}>
            {lang.settings.options_1.appearance.content.sub_text1}
          </Label>
        </div>
        <RadioContainer
          bg={colors.background1}
          onClick={() => {
            if (current !== "dark")
              api.send("change:theme:schema", { schema: "dark" });
          }}
        >
          <RadioOpt
            color={colors.primary}
            bg={colors.navbar.background}
            type="radio"
            id="opt1"
            name="theme"
            value="dark"
            onChange={(e) => {
              if (current !== "dark")
                api.send("change:theme:schema", { schema: e.target.value });
            }}
            checked={current === "dark"}
          />
          <Label
            color={colors.fontPrimary}
            fs="14px"
            bold
            margin="0px 10px"
            htmlFor="opt1"
          >
            {lang.settings.options_1.appearance.content.radios.text1}
          </Label>
        </RadioContainer>
        <RadioContainer
          bg={colors.background1}
          onClick={() => {
            if (current !== "light")
              api.send("change:theme:schema", { schema: "light" });
          }}
        >
          <RadioOpt
            color={colors.primary}
            bg={colors.navbar.background}
            type="radio"
            id="opt2"
            name="theme"
            value="light"
            onChange={(e) => {
              if (current !== "light")
                api.send("change:theme:schema", { schema: e.target.value });
            }}
            checked={current === "light"}
          />
          <Label
            color={colors.fontPrimary}
            fs="14px"
            bold
            margin="0px 10px"
            htmlFor="opt2"
          >
            {lang.settings.options_1.appearance.content.radios.text2}
          </Label>
        </RadioContainer>
      </ThemeTogleContainer>

      <div style={{ width: "61vw", margin: "20px 0px 5px 0px" }}>
        <Label fs="18" bold color={colors.fontPrimary}>
          {lang.settings.options_1.appearance.content.sub_text2}
        </Label>
      </div>
      <ThemeContainer>
        <ThemeDescriptor colors={newColors} width="60vw" height="60vh" />
      </ThemeContainer>
      <div style={{ width: "60vw" }}>
        <Options>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.primary}
              onChange={(e) => {
                setNewColors((c) => ({ ...c, primary: e.target.value }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.primary}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({ ...c, primary: v }));
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.secondary}
              onChange={(e) => {
                setNewColors((c) => ({ ...c, secondary: e.target.value }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.secondary}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({ ...c, secondary: v }));
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.background1}
              onChange={(e) => {
                setNewColors((c) => ({ ...c, background1: e.target.value }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.background1}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({ ...c, background1: v }));
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.background2}
              onChange={(e) => {
                setNewColors((c) => ({ ...c, background2: e.target.value }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.background2}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({ ...c, background2: v }));
              }}
            />
          </ColorOptContainer>
        </Options>
        <Options>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.navbar.background}
              onChange={(e) => {
                setNewColors((c) => ({
                  ...c,
                  navbar: { ...c.navbar, background: e.target.value },
                }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.navbar.background}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({
                  ...c,
                  navbar: { ...c.navbar, background: v },
                }));
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.navbar.buttons.color}
              onChange={(e) => {
                setNewColors((c) => ({
                  ...c,
                  navbar: {
                    ...c.navbar,
                    buttons: { ...c.navbar.buttons, color: e.target.value },
                  },
                }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.navbar.buttons.color}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({
                  ...c,
                  navbar: {
                    ...c.navbar,
                    buttons: { ...c.navbar.buttons, color: v },
                  },
                }));
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.fontPrimary}
              onChange={(e) => {
                setNewColors((c) => ({ ...c, fontPrimary: e.target.value }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.fontPrimary}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({ ...c, fontPrimary: v }));
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.fontSecondary}
              onChange={(e) => {
                setNewColors((c) => ({ ...c, fontSecondary: e.target.value }));
              }}
            />
            <ColorText
              spellCheck={false}
              color={colors.fontSecondary}
              required
              minLength={7}
              maxLength={7}
              type="text"
              value={newColors.fontSecondary}
              onChange={(e) => {
                const v = cleanColor(e);
                setNewColors((c) => ({ ...c, fontSecondary: v }));
              }}
            />
          </ColorOptContainer>
        </Options>
        <BtnContainer>
          <Btn
            bg={colors.secondary}
            width="70px"
            heigth="30px"
            margin="10px 10px 0px 0px"
            onClick={() => {
              api.send("revert:theme", { schema: current });
            }}
          >
            <Label fs="14px" color={colors.fontPrimary} bold>
              {lang.settings.options_1.appearance.content.btn_text1}
            </Label>
          </Btn>
          <Btn
            bg={colors.primary}
            width="70px"
            heigth="30px"
            margin="10px 0px 0px 0px"
            onClick={() => {
              api.send("new:theme", { newColors, schema: current });
            }}
          >
            <Label fs="14px" color={colors.fontPrimary} bold>
              {lang.settings.options_1.appearance.content.btn_text2}
            </Label>
          </Btn>
        </BtnContainer>
      </div>
    </Container>
  );
};

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const ThemeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0px;
`;

const ColorOptContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
`;

const ColorPicker = styled.input`
  border: none;
  outline: none;
  appearance: none;
  width: 22px;
  height: 24px;
  cursor: pointer;
  background-color: transparent;

  &::-webkit-color-swatch {
    border: 1px solid black;
    appearance: none;
  }
`;

const ColorText = styled.input<{ color: string }>`
  border: none;
  outline: none;
  appearance: none;
  background-color: transparent;
  text-transform: uppercase;
  color: ${(p) => p.color};
  width: 4rem;
`;

const RadioOpt = styled.input<{ bg: string; color: string }>`
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

const ThemeTogleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 30px 0px 10px 0px;
`;

const Btn = styled.button<{
  bg: string;
  width: string;
  heigth: string;
  margin?: string;
}>`
  border: none;
  outline: none;
  background-color: ${(p) => p.bg};
  border-radius: 4px;
  width: ${(p) => p.width};
  height: ${(p) => p.heigth};
  margin: ${(p) => p.margin || "0px"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${(p) => p.bg + "aa"};
  }
`;

function cleanColor(e: React.ChangeEvent<HTMLInputElement>) {
  let v = e.target.value;
  if (v === "") {
    v = "#000000";
  } else if (!v.startsWith("#")) {
    v = "#" + v.slice(0, v.length - 1);
  }
  return v;
}
