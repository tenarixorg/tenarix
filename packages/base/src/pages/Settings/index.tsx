import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RiCloseLine } from "react-icons/ri";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Advanced, Appearance, Source } from "./App";
import { useTheme } from "context-providers";

const { api } = window.bridge;

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: relative;
`;

const Section = styled.div`
  display: grid;
  grid-template-columns: 220px calc(100% - 220px);
  grid-template-rows: auto;
  width: 100%;
  height: 100vh;
`;

const SourceContainer = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 10px;
  background-color: ${(p) => p.bg};
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 2%;
  right: 2%;
`;

const Btn = styled.button<{
  margin: string;
  bg: string;
  hc: string;
  borderColor: string;
}>`
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 50%;
  z-index: 100;
  width: 36px;
  height: 36px;
  margin: ${(p) => p.margin};
  background-color: transparent;
  border: 2px solid ${(p) => p.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${(p) => p.hc};
  }
`;

const Panel = styled.div<{ bg: string; scrollBg: string }>`
  background-color: ${(p) => p.bg};
  height: 100vh;
  width: 100%;
  padding: 10px 10px 40px 10px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 2px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollBg};
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollBg};
  }
`;

const Setting = styled.div<{ noBorder?: boolean }>`
  border-top: ${(p) => (p.noBorder ? "0" : "1")}px solid #333333b9;
  width: 100%;
  margin: 10px 0px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-top: ${(p) => (p.noBorder ? "0px" : "10px")};
`;

const SettingOpt = styled.button<{ hc: string; selected?: boolean }>`
  border: none;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: 30px;
  margin-top: 10px;
  padding: 0px 10px;
  border-radius: 5px;
  background-color: ${(p) => (p.selected ? p.hc : "transparent")};
  &:hover {
    background-color: ${(p) => p.hc};
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 15px;
  font-weight: 500;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 0px 0px 10px;
  font-weight: 600;
`;

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
    <Container>
      <Section>
        <Panel bg={colors.background1} scrollBg={colors.primary}>
          <Setting noBorder>
            <Header>
              <p style={{ color: colors.fontPrimary }}>
                Ajustes de la Aplicación
              </p>
            </Header>
            <SettingOpt
              selected={window.location.href.endsWith("source")}
              hc={colors.buttons.hover}
              onClick={() => {
                navigation("/settings/source");
              }}
            >
              <p style={{ color: colors.fontSecondary }}>Extensión</p>
            </SettingOpt>
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
        </Panel>
        <SourceContainer bg={colors.background2}>
          <div>
            <Routes>
              <Route path="/source" element={<Source />} />
              <Route path="/appearance" element={<Appearance />} />
              <Route path="/advanced" element={<Advanced />} />
            </Routes>
          </div>
        </SourceContainer>
      </Section>
      <BtnContainer>
        <Btn
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
        </Btn>
      </BtnContainer>
    </Container>
  );
};
