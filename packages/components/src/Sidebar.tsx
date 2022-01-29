/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import styled from "styled-components";
import { RiArrowLeftSLine } from "react-icons/ri";
import { IoCogOutline, IoHeartOutline } from "react-icons/io5";
import { FaRegCompass } from "react-icons/fa";
import { BaseTheme } from "types";

const upAni = "translateY(-3px)";
const rotAni = "rotate(45deg)";
const rotAni2 = "rotate(-90deg)";
const leftAni = "translateX(-4px)";

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
  z-index: 100;
  position: absolute;
  top: 0;
`;

const BottomOpts = styled.div`
  position: absolute;
  bottom: 10%;
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
  settings: () => void;
  favorites: () => void;
  closed?: boolean;
  colors: BaseTheme;
}
export const Sidebar = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Container
      closed={props.closed}
      bg={props.colors.navbar.background}
      ref={ref}
    >
      <Btn onClick={props.back} animation={leftAni} margin="0px 0px 10px 0px">
        <RiArrowLeftSLine size={28} color={props.colors.navbar.buttons.color} />
      </Btn>

      <BottomOpts>
        <Btn onClick={props.home} margin="0px 0px 20px 0px" animation={rotAni2}>
          <FaRegCompass size={20} color={props.colors.navbar.buttons.color} />
        </Btn>
        <Btn
          animation={upAni}
          onClick={props.favorites}
          margin="0px 0px 20px 0px"
        >
          <IoHeartOutline size={24} color={props.colors.navbar.buttons.color} />
        </Btn>
        <Btn
          animation={rotAni}
          onClick={props.settings}
          margin="0px 0px 5px 0px"
        >
          <IoCogOutline size={24} color={props.colors.navbar.buttons.color} />
        </Btn>
      </BottomOpts>
    </Container>
  );
});
