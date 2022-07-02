import React, { useEffect, useRef, useState } from "react";
import { Advanced, Appearance, Language } from "./App";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLang, useTheme } from "context-providers";
import { RiCloseLine } from "react-icons/ri";
import {
  SBtn,
  SPanel,
  Setting,
  Header2,
  SSection,
  Container,
  SettingOpt,
  SBtnContainer,
  SSourceContainer,
} from "components/src/Elements";

const { api } = window.bridge;

export const Settings: React.FC = () => {
  const mounted = useRef(false);
  const navigation = useNavigate();
  const { colors } = useTheme();
  const { lang } = useLang();
  const [lastRoute, setLastRoute] = useState("");

  useEffect(() => {
    mounted.current = true;
    api.on("res:last:route", (_e, res) => {
      if (mounted.current) setLastRoute(res);
    });
    api.send("get:last:route");
    return () => {
      api.removeAllListeners("res:last:route");
      mounted.current = false;
    };
  }, []);

  return (
    <Container bg={colors.background2} scrollColor={colors.primary} noScroll>
      <SSection>
        <SPanel bg={colors.background1} scrollBg={colors.primary}>
          <Setting noBorder>
            <Header2>
              <p style={{ color: colors.fontPrimary }}>
                {lang.settings.options_1.head}
              </p>
            </Header2>
            <SettingOpt
              selected={window.location.href.endsWith("appearance")}
              hc={colors.buttons.hover}
              onClick={() => {
                navigation("/settings/appearance");
              }}
            >
              <p style={{ color: colors.fontSecondary }}>
                {lang.settings.options_1.appearance.option_text}
              </p>
            </SettingOpt>
            <SettingOpt
              selected={window.location.href.endsWith("language")}
              hc={colors.buttons.hover}
              onClick={() => {
                navigation("/settings/language");
              }}
            >
              <p style={{ color: colors.fontSecondary }}>
                {lang.settings.options_1.language.option_text}
              </p>
            </SettingOpt>
            <SettingOpt
              selected={window.location.href.endsWith("advanced")}
              hc={colors.buttons.hover}
              onClick={() => {
                navigation("/settings/advanced");
              }}
            >
              <p style={{ color: colors.fontSecondary }}>
                {lang.settings.options_1.advanced.option_text}
              </p>
            </SettingOpt>
          </Setting>
        </SPanel>
        <SSourceContainer bg={colors.background2}>
          <div style={{ width: "100%" }}>
            <Routes>
              <Route path="/appearance" element={<Appearance />} />
              <Route path="/language" element={<Language />} />
              <Route path="/advanced" element={<Advanced />} />
            </Routes>
          </div>
        </SSourceContainer>
      </SSection>
      <SBtnContainer>
        <SBtn
          borderColor={colors.buttons.border}
          hc={colors.buttons.hover}
          bg="transparent"
          margin="0px 0px 0px 10px"
          onClick={() => {
            navigation(lastRoute);
          }}
        >
          <RiCloseLine size={25} color={colors.buttons.color} />
        </SBtn>
      </SBtnContainer>
    </Container>
  );
};
