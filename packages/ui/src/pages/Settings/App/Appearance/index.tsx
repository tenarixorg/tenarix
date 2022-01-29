import React, { useEffect, useRef, useCallback, useReducer } from "react";
import { cleanColor, initialState, reducer } from "./helper";
import { ThemeDescriptor, ThemeSelector } from "components";
import { useLang, useTheme } from "context-providers";
import { useNavigate } from "react-router-dom";
import { Container } from "components/src/Elements";
import {
  Btn,
  Label,
  Options,
  RadioOpt,
  FileCard,
  ColorText,
  ColorPicker,
  BtnContainer,
  FilenameInput,
  RadioContainer,
  ModalContainer,
  ThemeContainer,
  ColorOptContainer,
  ThemeTogleContainer,
} from "components/src/Elements/Appearance";

const { api } = window.bridge;

export const Appearance: React.FC = () => {
  const mounted = useRef(false);
  const navigation = useNavigate();
  const fileCardRef = useRef<HTMLFormElement | null>(null);
  const saveBtnRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { colors } = useTheme();
  const { lang } = useLang();

  const [
    { values, options, current, filename, showFileCard, loading, newColors },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    api.on("res:theme:schema", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setCurrent", payload: res.schema });
        dispatch({ type: "setValues", payload: [res.themeName] });
      }
    });
    api.on("res:external:themes", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setOptions", payload: res });
        dispatch({ type: "setLoading", payload: false });
      }
    });
    api.send("get:theme:schema");
    api.send("get:external:themes");
    mounted.current = true;
    return () => {
      api.removeAllListeners("res:theme:schema");
      api.removeAllListeners("res:external:themes");
      mounted.current = false;
    };
  }, []);

  const handleFileCard = useCallback((e: MouseEvent) => {
    if (
      !fileCardRef.current?.contains(e.target as Node) &&
      !saveBtnRef.current?.contains(e.target as Node)
    ) {
      if (mounted.current)
        dispatch({ type: "setShowFileCard", payload: false });
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "setNewColors", payload: colors });
  }, [colors]);

  useEffect(() => {
    document.addEventListener("click", handleFileCard);
    return () => {
      document.removeEventListener("click", handleFileCard);
    };
  }, [handleFileCard]);

  return (
    <Container
      bg={colors.background2}
      scrollColor={colors.primary}
      padding="0px 0px 50px 0px"
    >
      <ModalContainer show={showFileCard}>
        <FileCard
          ref={fileCardRef}
          bg={colors.background1 + "c0"}
          onSubmit={(e) => {
            e.preventDefault();
            if (filename !== "") {
              api.send("save:external:theme", {
                filename: filename.toLowerCase().replace(" ", "_") + ".json",
                data: newColors,
                schema: current,
              });
              dispatch({ type: "setShowFileCard", payload: false });
              dispatch({ type: "setFilename", payload: "" });
            }
          }}
        >
          <FilenameInput
            ref={fileInputRef}
            disabled={!showFileCard}
            color={colors.fontPrimary}
            borderColor={colors.primary}
            type="text"
            value={filename}
            placeholder="Filename"
            onChange={(e) => {
              dispatch({ type: "setFilename", payload: e.target.value });
            }}
          />
        </FileCard>
      </ModalContainer>
      <div style={{ width: "60vw", margin: "10px 0px 0px -4%" }}>
        <p style={{ color: colors.fontSecondary, fontSize: 18 }}>
          {lang.settings.options_1.appearance.content.head_text}
        </p>
      </div>

      <ThemeTogleContainer>
        <div style={{ width: "61vw", margin: "5px 0px" }}>
          <Label
            fs="18"
            bold
            color={colors.fontPrimary}
            style={{ cursor: "default" }}
          >
            {lang.settings.options_1.appearance.content.sub_text1 + "s"}
          </Label>
        </div>
        <div
          style={{
            width: "61vw",
            margin: "5px 0px 20px 0px",
          }}
        >
          <ThemeSelector
            colors={colors}
            placeholder="Search"
            options={options}
            values={values}
            loading={loading}
            onChange={(vs) => {
              if ((vs as any)[0].value !== "") {
                dispatch({ type: "setValues", payload: vs });
                api.send("set:external:theme", { file: (vs as any)[0].value });
              }
            }}
          />
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
        <Label
          fs="18"
          bold
          color={colors.fontPrimary}
          style={{ cursor: "default" }}
        >
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
                dispatch({ type: "setPrimary", payload: e.target.value });
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
                dispatch({ type: "setPrimary", payload: cleanColor(e) });
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.secondary}
              onChange={(e) => {
                dispatch({ type: "setSecondary", payload: e.target.value });
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
                dispatch({ type: "setSecondary", payload: cleanColor(e) });
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.background1}
              onChange={(e) => {
                dispatch({ type: "setBackground1", payload: e.target.value });
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
                dispatch({ type: "setBackground1", payload: cleanColor(e) });
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.background2}
              onChange={(e) => {
                dispatch({ type: "setBackground2", payload: e.target.value });
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
                dispatch({ type: "setBackground2", payload: cleanColor(e) });
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
                dispatch({
                  type: "setNavBackground",
                  payload: e.target.value,
                });
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
                dispatch({
                  type: "setNavBackground",
                  payload: cleanColor(e),
                });
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.navbar.buttons.color}
              onChange={(e) => {
                dispatch({ type: "setNavBtnsColors", payload: e.target.value });
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
                dispatch({ type: "setNavBtnsColors", payload: cleanColor(e) });
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.fontPrimary}
              onChange={(e) => {
                dispatch({ type: "setFontPrimary", payload: e.target.value });
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
                dispatch({ type: "setFontPrimary", payload: cleanColor(e) });
              }}
            />
          </ColorOptContainer>
          <ColorOptContainer>
            <ColorPicker
              type="color"
              value={newColors.fontSecondary}
              onChange={(e) => {
                dispatch({ type: "setFontSecondary", payload: e.target.value });
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
                dispatch({ type: "setFontSecondary", payload: cleanColor(e) });
              }}
            />
          </ColorOptContainer>
        </Options>
        <BtnContainer>
          <Btn
            ref={saveBtnRef}
            bg={colors.secondary}
            width="70px"
            heigth="30px"
            margin="10px 10px 0px 0px"
            onClick={() => {
              dispatch({ type: "toggleShowFileCard" });
              fileInputRef.current?.focus();
            }}
          >
            <Label fs="14px" color={colors.fontPrimary} bold>
              {lang.settings.options_1.appearance.content.btn_text1}
            </Label>
          </Btn>
          <Btn
            bg={colors.secondary}
            width="70px"
            heigth="30px"
            margin="10px 10px 0px 0px"
            onClick={() => {
              navigation("/editor/theme", {
                state: {
                  filename: values[0].value,
                },
              });
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
