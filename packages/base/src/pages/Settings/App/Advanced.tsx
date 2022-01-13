import React from "react";
import { useTheme, useLang } from "context-providers";
import { Container } from "components/src/Elements";

export const Advanced: React.FC = () => {
  const { colors } = useTheme();
  const { lang } = useLang();
  return (
    <Container bg={colors.background2} scrollColor={colors.primary}>
      <p style={{ color: colors.fontSecondary }}>
        {lang.settings.options_1.advanced.option_text}
      </p>
    </Container>
  );
};
