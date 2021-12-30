import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { MdSearch } from "react-icons/md";
import {
  RiArrowLeftSLine,
  RiCloseFill,
  RiCheckboxMultipleBlankLine,
  RiSubtractFill,
  RiArrowRightSLine,
  RiHome2Line,
  RiCheckboxBlankLine,
} from "react-icons/ri";

const { api } = window.bridge;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: black;
  position: fixed;
  top: 0;
  z-index: 100;
`;

const Drag = styled.div`
  flex-grow: 1;
  height: 30px;
  -webkit-app-region: drag;
`;

const Input = styled.input<{ width: string }>`
  border: none;
  outline: none;
  border-bottom: 1px solid white;
  background-color: black;
  color: white;
  width: ${(p) => p.width};
  transition: width 300ms ease-in-out;
  margin-right: 10px;
`;

const Menu = styled.div<{
  width: string;
  dir: "left" | "right";
  padding?: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${(p) => (p.dir === "right" ? "flex-end" : "flex-start")};
  align-items: center;
  list-style: none;
  width: ${(p) => p.width};
  padding: ${(p) => (p.padding !== "" ? p.padding : "0px")};
`;

const Item = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  margin: 0px;
`;

const Btn = styled.button<{ hc: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: none;
  outline: none;
  &:hover {
    background-color: ${(p) => p.hc};
  }
`;

interface Props {
  close: () => void;
  minimize: () => void;
  maximize: () => void;
  back: () => void;
  home: () => void;
  forward: () => void;
}

export const Navbar: React.FC<Props> = (props) => {
  const [resize, setResize] = useState(true);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = useCallback(
    (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setSearch(false);
      }
    },
    [inputRef]
  );

  useEffect(() => {
    api.on("resize", (_e, p) => {
      setResize(p);
    });

    document.addEventListener("mousedown", handleSearch);

    return () => {
      document.removeEventListener("mousedown", handleSearch);
      api.removeAllListeners("resize");
    };
  }, []);
  return (
    <Container>
      <Menu width="fit-content" dir="left" padding="0px">
        <Item>
          <Btn onClick={props.back} hc="#c4c4c42f">
            <RiArrowLeftSLine size={22} color="#ffffff" />
          </Btn>
        </Item>
        <Item>
          <Btn onClick={props.home} hc="#c4c4c42f">
            <RiHome2Line size={18} color="#ffffff" />
          </Btn>
        </Item>
        <Item>
          <Btn onClick={props.forward} hc="#c4c4c42f">
            <RiArrowRightSLine size={22} color="#ffffff" />
          </Btn>
        </Item>
      </Menu>
      <Drag />
      <Menu width="fit-content" dir="right">
        <Item>
          <Btn
            hc="#c4c4c42f"
            onClick={() => {
              setSearch((c) => !c);
              inputRef.current?.focus();
            }}
          >
            <MdSearch size={22} color="#ffffff" />
          </Btn>
        </Item>
        <Item>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(false);
              setQuery("");
              window.location.href = `#/library/${query}`;
            }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              ref={inputRef}
              type="text"
              width={search ? "200px" : "0px"}
            />
          </form>
        </Item>
        <Item>
          <Btn
            hc="#c4c4c42f"
            onClick={props.minimize}
            style={{
              alignItems: "flex-end",
            }}
          >
            <RiSubtractFill size={22} color="#ffffff" />
          </Btn>
        </Item>
        <Item>
          <Btn onClick={props.maximize} hc="#c4c4c42f">
            {resize ? (
              <RiCheckboxMultipleBlankLine size={18} color="#ffffff" />
            ) : (
              <RiCheckboxBlankLine size={18} color="#ffffff" />
            )}
          </Btn>
        </Item>
        <Item>
          <Btn onClick={props.close} hc="#f41d1d">
            <RiCloseFill size={22} color="#ffffff" />
          </Btn>
        </Item>
      </Menu>
    </Container>
  );
};
