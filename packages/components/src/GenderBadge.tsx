import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #2076ee;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border: 1px solid #ffffff50;
  cursor: pointer;
  margin: 5px 10px 5px 0px;
`;

interface Props {
  text: string;
}

export const GenderBadge: React.FC<Props> = (props) => {
  return <Container>{props.text}</Container>;
};
