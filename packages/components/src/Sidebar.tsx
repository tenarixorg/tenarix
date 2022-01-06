/* eslint-disable react/display-name */
import React from "react";
import styled from "styled-components";
import { Theme } from "utils";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiHome2Line,
} from "react-icons/ri";
import { BsBook } from "react-icons/bs";
import { IoCogOutline } from "react-icons/io5";

const upAni = "translateY(-4px)";
const rotAni = "rotate(45deg)";
const leftAni = "translateX(-4px)";
const rightAni = "translateX(4px)";

const Container = styled.div<{ closed?: boolean; bg: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  height: 100vh;
  width: ${(p) => (p.closed ? "0px" : "32px")};
  transition: width 400ms ease-in-out;
  background-color: ${(p) => p.bg};
  z-index: 10;
  position: absolute;
  top: 0;
`;

const BottomOpts = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Btn = styled.button<{ margin: string; animation?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 100%;
  border: none;
  outline: none;
  margin: ${(p) => p.margin};
  transition: transform 400ms ease-in-out;
  cursor: pointer;
  &:hover {
    ${(p) => (p.animation ? `transform: ${p.animation}` : "")}
  }
`;

interface Props {
  back: () => void;
  home: () => void;
  forward: () => void;
  settings: () => void;
  favorites: () => void;
  closed?: boolean;
  colors: Theme["dark"];
}
export const Sidebar = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Container
      closed={props.closed}
      bg={props.colors.navbar.background}
      ref={ref}
    >
      <Btn onClick={props.home} margin="0px 0px 5px 0px" animation={upAni}>
        <RiHome2Line size={18} color={props.colors.navbar.buttons.color} />
      </Btn>
      <Btn onClick={props.back} animation={leftAni} margin="0px 0px 5px 0px">
        <RiArrowLeftSLine size={28} color={props.colors.navbar.buttons.color} />
      </Btn>
      <Btn
        onClick={props.forward}
        animation={rightAni}
        margin="0px 0px 5px 0px"
      >
        <RiArrowRightSLine
          size={28}
          color={props.colors.navbar.buttons.color}
        />
      </Btn>

      <BottomOpts>
        <Btn
          animation={upAni}
          onClick={props.favorites}
          margin="0px 0px 10px 0px"
        >
          <BsBook size={19} color={props.colors.navbar.buttons.color} />
        </Btn>
        <Btn
          animation={rotAni}
          onClick={props.settings}
          margin="0px 0px 5px 0px"
        >
          <IoCogOutline size={22} color={props.colors.navbar.buttons.color} />
        </Btn>
      </BottomOpts>
    </Container>
  );
});
