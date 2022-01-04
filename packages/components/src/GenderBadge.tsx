import React from "react";
import styled from "styled-components";
import { Theme } from "utils";

const Container = styled.div<{ bg: string; border: string }>`
  background-color: ${(p) => p.bg};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border: 1px solid ${(p) => p.border};
  cursor: pointer;
  margin: 5px 10px 5px 0px;
`;

interface Props {
  text: string;
  colors: Theme["dark"];
}

export const GenderBadge: React.FC<Props> = (props) => {
  return (
    <Container bg={props.colors.primary} border={props.colors.buttons.border}>
      {props.text}
    </Container>
  );
};
