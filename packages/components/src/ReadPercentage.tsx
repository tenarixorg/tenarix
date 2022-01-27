import React from "react";
import styled from "styled-components";

interface Props {
  bg: string;
  size: number;
  color: string;
  percentage: number;
  stroke?: string;
}

export const ReadPercentage: React.FC<Props> = ({
  bg,
  size,
  color,
  percentage,
  stroke,
}) => {
  return (
    <Eye
      size={size}
      percentage={percentage > 100 ? 100 : percentage < 0 ? 0 : percentage}
      color={color}
      bg={bg}
      stroke={stroke}
    >
      <Circle color={color} size={size} />
    </Eye>
  );
};

const Eye = styled.div<{
  size: number;
  percentage: number;
  bg: string;
  color: string;
  stroke?: string;
}>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border: solid ${(p) => p.stroke || "1px"} ${(p) => p.color};
  border-radius: 75% 0%;
  position: relative;
  transform: rotate(45deg);
  overflow: hidden;

  &::before {
    content: "";
    opacity: 0;
  }

  &:hover {
    &::before {
      /* opacity: 1;
      transition: opacity 0s linear 1s; */
      content: " (Forgetfulness is a form of freedom. - Kahlil Gibran)";
    }
  }

  &::after {
    content: "";
    width: 200%;
    height: 82%;
    transform: rotate(-45deg) translateY(calc(100% - ${(p) => p.percentage}%));
    background-color: ${(p) => p.bg};
    position: absolute;
    top: 9%;
    left: -50%;
    z-index: 2;
    transition: transform 400ms ease-in-out;
  }
`;

const Circle = styled.div<{ size: number; color: string }>`
  position: absolute;
  width: calc(${(p) => p.size}px * 0.4);
  height: calc(${(p) => p.size}px * 0.4);
  border-radius: 50%;
  left: 28.1225%;
  top: 28.1225%;
  transform: rotate(-45deg);
  background-color: ${(p) => p.color};
  z-index: 3;
`;
