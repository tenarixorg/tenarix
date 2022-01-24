import React from "react";
import styled from "styled-components";
import { BaseTheme } from "types";

interface Props {
  colors: BaseTheme;
  width: string;
  height: string;
}

export const ThemeDescriptor: React.FC<Props> = ({ colors, width, height }) => {
  return (
    <Container width={width} height={height}>
      <Nav bg={colors.navbar.background} />
      <Side bg={colors.navbar.background} />
      <Circle
        bg={colors.navbar.buttons.color}
        top="calc(0.2vw + 0.5vh)"
        left="97%"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="calc(0.2vw + 0.5vh)"
        left="94%"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="calc(0.2vw + 0.5vh)"
        left="91%"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="calc(0.2vw + 0.5vh)"
        left="calc(0.2vw + 0.5vh)"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="20%"
        left="calc(0.2vw + 0.5vh)"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="25%"
        left="calc(0.2vw + 0.5vh)"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="85%"
        left="calc(0.2vw + 0.5vh)"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="90%"
        left="calc(0.2vw + 0.5vh)"
      />
      <Circle
        bg={colors.navbar.buttons.color}
        top="95%"
        left="calc(0.2vw + 0.5vh)"
      />
      <Panel
        width="30%"
        left="calc(1.2vw + 1.2vh)"
        top="calc(1.2vw + 1.2vh)"
        bg={colors.background1}
        borderColor={colors.navbar.background}
        bb
      />
      <Panel
        width="70%"
        left="30%"
        top="calc(1.2vw + 1.2vh)"
        bg={colors.background2}
        borderColor={colors.navbar.background}
        bb
        br
      />
      <Card>
        <Primary bg={colors.primary} />
        <Secondary bg={colors.secondary} />
      </Card>
      <TextSample>
        <Txt fs="1.6vw" color={colors.fontPrimary} bold>
          Lorem, ipsum.
        </Txt>
        <Txt fs="1.4vw" color={colors.fontSecondary} margin="4px 0px">
          Dolor sit immo.
        </Txt>
        <Txt fs="1.4vw" color={colors.fontSecondary}>
          Dolor sit immo.
        </Txt>
      </TextSample>
    </Container>
  );
};

interface IDivElement {
  bg: string;
  top?: string;
  left?: string;
  borderColor?: string;
  br?: boolean;
  bb?: boolean;
  width?: string;
}

interface ITxtElement {
  fs: string;
  color: string;
  margin?: string;
  bold?: boolean;
}

const Txt = styled.p.attrs<ITxtElement>((p) => ({
  style: {
    color: p.color,
  },
}))<ITxtElement>`
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "bold" : "normal")};
  margin: ${(p) => p.margin || "0px"};
  transition: none;
`;

const Container = styled.div<{
  width: string;
  height: string;
}>`
  position: relative;
  box-shadow: 4px 4px 9px -5px #000000;
  margin: 5px;
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  background-color: transparent;
`;

const Nav = styled.div.attrs<IDivElement>((p) => ({
  style: {
    backgroundColor: p.bg,
  },
}))<IDivElement>`
  position: absolute;
  width: 100%;
  height: calc(1.2vw + 1.2vh);
  left: 0;
  top: 0;
  transition: none;
`;
const Side = styled.div.attrs<IDivElement>((p) => ({
  style: {
    backgroundColor: p.bg,
  },
}))<IDivElement>`
  position: absolute;
  width: calc(1.2vw + 1.2vh);
  height: 100%;
  left: 0;
  top: 0;
  transition: none;
`;

const Circle = styled.div.attrs<IDivElement>((p) => ({
  style: {
    backgroundColor: p.bg,
  },
}))<IDivElement>`
  width: calc(0.3vw + 1vh);
  height: calc(0.3vw + 1vh);
  border-radius: 50%;
  position: absolute;
  top: ${(p) => p.top};
  left: ${(p) => p.left};
  z-index: 2;
  transition: none;
`;

const Panel = styled.div.attrs<IDivElement>((p) => ({
  style: {
    backgroundColor: p.bg,
    borderRight: `${p.br ? "1" : "0"}px solid ${
      p.borderColor || "transparent"
    };`,
    borderBottom: `${p.bb ? "1" : "0"}px solid ${
      p.borderColor || "transparent"
    };`,
  },
}))<IDivElement>`
  position: absolute;
  height: calc(100% - ${(p) => p.top});
  width: ${(p) => p.width};
  top: ${(p) => p.top};
  left: ${(p) => p.left};
  transition: none;
`;

const Card = styled.div`
  z-index: 2;
  position: absolute;
  width: 22vh;
  height: 30vh;
  background-color: #c4c4c410;
  top: 15%;
  left: 35%;
  box-shadow: 4px 4px 9px -5px #000000;
`;

const Primary = styled.div.attrs<IDivElement>((p) => ({
  style: { backgroundColor: p.bg },
}))<IDivElement>`
  position: absolute;
  width: 80%;
  height: 10%;
  left: 0;
  top: 75%;
  transition: none;
`;
const Secondary = styled.div.attrs<IDivElement>((p) => ({
  style: { backgroundColor: p.bg },
}))<IDivElement>`
  position: absolute;
  width: 50%;
  height: 10%;
  left: 50%;
  top: 15%;
  transition: none;
`;

const TextSample = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 1vw;
  top: 4vh;
  left: 2vw;
`;
