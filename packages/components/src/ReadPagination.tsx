import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BsChevronCompactDown } from "react-icons/bs";
import { Txt } from "./Elements";

const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
  color: string;
  listColor: string;
  listScrollColor: string;
  listBg: string;
  selectedItemColor: string;
  fs: string;
}

export const ReadPagination: React.FC<Props> = ({
  min,
  max,
  value,
  onChange,
  color,
  fs,
  listColor,
  listScrollColor,
  listBg,
  selectedItemColor,
}) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const mounted = useRef(false);

  const [show, setShow] = useState(false);

  const handleShow = useCallback((e: MouseEvent) => {
    if (
      !listRef.current?.contains(e.target as Node) &&
      !btnRef.current?.contains(e.target as Node)
    ) {
      if (mounted.current) setShow(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    document.addEventListener("mousedown", handleShow);
    return () => {
      mounted.current = false;
      document.removeEventListener("mousedown", handleShow);
    };
  }, [handleShow]);

  return (
    <Container>
      <Container>
        <Txt fs={fs} color={color} style={{ textAlign: "center" }}>
          {value}
        </Txt>

        <Btn
          ref={btnRef}
          width={fs}
          top={"90%"}
          len={max.toString().length - value.toString().length}
          animate={show}
          onClick={() => {
            setShow((c) => !c);
          }}
        >
          <BsChevronCompactDown color={color} size={`calc(${fs} * 0.9)`} />
        </Btn>

        <List
          scrollColor={listScrollColor}
          ref={listRef}
          fs={fs}
          heigth={show ? `calc(${max + 1} * ${fs} + ${fs})` : "0px"}
          width={`calc(${fs} * ${max.toString().length})`}
          bg={listBg}
          len={max.toString().length - value.toString().length}
          top="160%"
        >
          {range(min, max).map((el, i) => (
            <Item
              color={el === value ? selectedItemColor : listColor}
              key={i}
              onClick={() => {
                onChange(el);
                setShow(false);
              }}
            >
              {el}
            </Item>
          ))}
        </List>
      </Container>
      <Container>
        <Txt
          fs={fs}
          color={color}
          margin="0px 5px"
          style={{ textAlign: "center" }}
        >
          /
        </Txt>
        <Txt fs={fs} color={color} style={{ textAlign: "center" }}>
          {max}
        </Txt>
      </Container>
    </Container>
  );
};

const Item = styled.li`
  color: ${(p) => p.color};
  cursor: pointer;
`;

const List = styled.ul<{
  width: string;
  bg: string;
  top: string;
  len: number;
  heigth: string;
  fs: string;
  scrollColor: string;
}>`
  box-shadow: 4px 4px 9px -5px #000000;
  font-size: ${(p) => p.fs};
  max-height: 30vh;
  width: calc(${(p) => p.width} + 4px);
  background-color: ${(p) => p.bg};
  position: absolute;
  top: ${(p) => p.top};
  left: calc(50% - (${(p) => p.width} + 4px) / 2);
  height: ${(p) => p.heigth};
  z-index: 100;
  transition: height 200ms ease-in-out;
  border-radius: 4px;
  scroll-behavior: smooth;
  list-style: none;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  ::-webkit-scrollbar {
    width: 4px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollColor};
    border-radius: 30px;
    height: 50px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollColor};
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: fit-content;
`;

const Btn = styled.button<{
  width: string;
  top: string;
  len: number;
  animate?: boolean;
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  left: calc(50% - ${(p) => p.width} / 2);
  top: ${(p) => p.top};
  width: ${(p) => p.width};
  transition: transform 400ms ease-in-out;
  transform: rotate(${(p) => (p.animate ? "180" : "0")}deg);
`;
