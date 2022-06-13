import React from "react";
import { useTheme, useLang } from "context-providers";
import { Btn, Container, Txt } from "components/src/Elements";
import { useNavigate } from "react-router-dom";

export const Advanced: React.FC = () => {
  const navigation = useNavigate();
  const { colors } = useTheme();
  const { lang } = useLang();
  return (
    <Container bg={colors.background2} scrollColor={colors.primary}>
      <p style={{ color: colors.fontSecondary }}>
        {lang.settings.options_1.advanced.option_text}
      </p>

      <Btn
        onClick={() => {
          navigation("/editor/setup");
        }}
        style={{
          backgroundColor: colors.primary,
          width: "100px",
          height: "50px",
        }}
      >
        <Txt fs="16x" bold color={colors.fontPrimary}>
          Edit Settings
        </Txt>
      </Btn>
    </Container>
  );
};
