import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Advanced, Appearance } from "./App";
import { RiCloseLine } from "react-icons/ri";
import { useTheme } from "context-providers";
import {
  Container,
  Header2,
  SBtn,
  SBtnContainer,
  Setting,
  SettingOpt,
  SPanel,
  SSection,
  SSourceContainer,
} from "components/src/Elements";

const { api } = window.bridge;

export const Settings: React.FC = () => {
  const navigation = useNavigate();
  const { colors } = useTheme();
  const [prevUrl, setPrevUrl] = useState("");
  const [chsource, setChsource] = useState({ c: "", n: "" });

  useEffect(() => {
    api.on("res:change:source", (_e, res) => {
      setChsource(res);
    });
    setPrevUrl(window.history.state.prev);
  }, []);

  return (
    <Container bg={colors.background2} scrollColor={colors.primary}>
      <SSection>
        <SPanel bg={colors.background1} scrollBg={colors.primary}>
          <Setting noBorder>
            <Header2>
              <p style={{ color: colors.fontPrimary }}>
                Ajustes de la Aplicación
              </p>
            </Header2>
            <SettingOpt
              selected={window.location.href.endsWith("appearance")}
              hc={colors.buttons.hover}
              onClick={() => {
                navigation("/settings/appearance");
              }}
            >
              <p style={{ color: colors.fontSecondary }}>Apariencia</p>
            </SettingOpt>
            <SettingOpt
              selected={window.location.href.endsWith("advanced")}
              hc={colors.buttons.hover}
              onClick={() => {
                navigation("/settings/advanced");
              }}
            >
              <p style={{ color: colors.fontSecondary }}>Avanzado</p>
            </SettingOpt>
          </Setting>
        </SPanel>
        <SSourceContainer bg={colors.background2}>
          <div style={{ width: "100%" }}>
            <Routes>
              <Route path="/appearance" element={<Appearance />} />
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
            if (chsource.c !== chsource.n) {
              window.location.href = "#/";
            } else {
              window.location.href = prevUrl;
            }
          }}
        >
          <RiCloseLine size={25} color={colors.buttons.color} />
        </SBtn>
      </SBtnContainer>
    </Container>
  );
};
