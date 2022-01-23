import React, { useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { BaseTheme } from "types";
import { Txt } from "./Elements";

import { BsFillPinAngleFill } from "react-icons/bs";

const Container = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
  padding: 5px 0px;
  border-radius: 4px;
  background-color: ${(p) => p.bg};
  box-shadow: 4px 4px 9px -5px #000000;
  cursor: pointer;
  transition: transform 500ms ease-in-out;

  &:hover {
    transform: translate3D(-2px, -1px, 0px);
  }
`;

const Btn = styled.button<{ margin: string; pin?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 100%;
  border: none;
  outline: none;
  margin: ${(p) => p.margin};
  transform: translate3d(${(p) => (p.pin ? "-4px,4px,0px" : "0,0,0")});
  transition: transform 400ms ease-in-out;
  cursor: pointer;
  &:hover {
    transform: ${(p) => `translate3d(${p.pin ? "2px,-2px,0" : "-4px,4px,0"})`};
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px 5px;
`;

const BtnsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
`;

interface Props {
  name: string;
  lang: string;
  pin: () => void;
  go: () => void;
  colors: BaseTheme;
  pinned?: boolean;
}

export const ExtensionCard: React.FC<Props> = ({ pin, go, ...props }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const btnExcludeRef = useRef<HTMLButtonElement | null>(null);

  const handleCard = useCallback(
    (e: MouseEvent) => {
      if (!btnExcludeRef.current?.contains(e.target as Node)) {
        go();
      } else {
        pin();
      }
    },
    [pin, go]
  );
  useEffect(() => {
    const copy = cardRef.current;
    copy?.addEventListener("mousedown", handleCard);
    return () => {
      copy?.removeEventListener("mousedown", handleCard);
    };
  }, [handleCard]);

  return (
    <Container bg={props.colors.background2} ref={cardRef}>
      <Main>
        <Txt fs="16px" bold color={props.colors.fontPrimary}>
          {props.name}
        </Txt>
        <Txt fs="12px" bold color={props.colors.fontSecondary}>
          {props.lang}
        </Txt>
      </Main>
      <BtnsContainer>
        <Btn margin="0px" ref={btnExcludeRef} pin={props.pinned}>
          <BsFillPinAngleFill
            color={props.pinned ? props.colors.primary : props.colors.secondary}
            size={20}
          />
        </Btn>
      </BtnsContainer>
    </Container>
  );
};
