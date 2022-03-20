import React, { useEffect, useState } from "react";
import { BtnAni, Container, Txt } from "components/src/Elements";
import { useTheme } from "context-providers";
import { useNavigate } from "react-router-dom";

const { api } = window.bridge;

export const Welcome: React.FC = () => {
  const { colors } = useTheme();
  const [canNavigate, setCanNavigate] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    api.on("res:navigate", (_e, res) => {
      setCanNavigate(res);
    });
    return () => {
      api.removeAllListeners("res:navigate");
    };
  });

  useEffect(() => {
    if (canNavigate) {
      navigation("/ext");
    }
  }, [canNavigate, navigation]);

  return (
    <Container
      padding="0px 0px 22px 0px"
      scrollColor={colors.primary}
      bg={colors.background2}
    >
      <Txt fs="20px" bold color={colors.fontPrimary}>
        Welcome
      </Txt>

      <BtnAni
        onClick={() => {
          api.send("get:chromium");
        }}
        style={{
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 5,
          margin: 10,
        }}
      >
        <Txt fs="16px" bold color={colors.fontPrimary} pointer>
          Download Chromium
        </Txt>
      </BtnAni>
      <BtnAni
        onClick={() => {
          api.send("use:installed:browser");
        }}
        style={{
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 5,
          margin: 10,
        }}
      >
        <Txt fs="16px" bold color={colors.fontPrimary} pointer>
          Use Installed Browser
        </Txt>
      </BtnAni>
    </Container>
  );
};
