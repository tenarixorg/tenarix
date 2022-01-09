import React from "react";
import { Container } from "components/src/Elements";
import { useTheme } from "context-providers";

export const Advanced: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Container bg={colors.background2} scrollColor={colors.primary}>
      <p style={{ color: colors.fontSecondary }}>Avanzado</p>
    </Container>
  );
};
