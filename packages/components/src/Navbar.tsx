/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { MdSearch } from "react-icons/md";
import {
  RiCloseFill,
  RiCheckboxMultipleBlankLine,
  RiSubtractFill,
  RiCheckboxBlankLine,
} from "react-icons/ri";
import { AiOutlineMenu } from "react-icons/ai";
import { BaseTheme } from "types";

const { api } = window.bridge;

const Container = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${(p) => p.bg};
  top: 0;
  z-index: 100;
  height: 22px;
`;

const Drag = styled.div`
  flex-grow: 1;
  height: 22px;
  -webkit-app-region: drag;
`;

const Input = styled.input<{ width: string; bg: string; color: string }>`
  border: none;
  outline: none;
  border-bottom: 1px solid ${(p) => p.color};
  background-color: ${(p) => p.bg};
  color: ${(p) => p.color};
  width: ${(p) => p.width};
  transition: width 300ms ease-in-out;
  margin-right: 10px;
  font-size: 14px;
  line-height: 0px;
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
  width: 24px;
  height: 22px;
  border: none;
  outline: none;
  &:hover {
    background-color: ${(p) => p.hc};
  }
`;
const Btn2 = styled.button<{ hc: string; animate?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 24px;
  height: 22px;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: ${(p) => p.hc};
  }
  transition: transform 400ms ease-in-out;

  transform: rotate(${(p) => (p.animate ? "90" : "0")}deg);
`;

interface Props {
  close: () => void;
  minimize: () => void;
  maximize: () => void;
  sidebar: () => void;
  colors: BaseTheme;
  sideAni?: boolean;
}
export const Navbar = React.forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const [resize, setResize] = useState(true);
    const [search, setSearch] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const urlHandler = useCallback((e: PopStateEvent) => {
      const newUrl = (e.target as Window).location.href;

      if (
        newUrl.includes("home") ||
        newUrl.includes("read") ||
        newUrl.includes("library") ||
        newUrl.includes("details")
      ) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    }, []);

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
      window.addEventListener("popstate", urlHandler);

      return () => {
        document.removeEventListener("mousedown", handleSearch);
        api.removeAllListeners("resize");
        window.removeEventListener("popstate", urlHandler);
      };
    }, [handleSearch, urlHandler]);

    return (
      <Container bg={props.colors.navbar.background}>
        <Menu width="fit-content" dir="left" padding="0px">
          <Item>
            <Btn2
              animate={props.sideAni}
              onClick={() => {
                props.sidebar();
              }}
              hc="transparent"
              style={{ marginLeft: 2, width: 30 }}
              ref={ref}
            >
              <AiOutlineMenu
                size={18}
                color={props.colors.navbar.buttons.color}
              />
            </Btn2>
          </Item>
        </Menu>
        <Drag />
        <Menu width="fit-content" dir="right">
          {showSearch && (
            <>
              <Item>
                <Btn
                  hc={props.colors.navbar.buttons.hover}
                  onClick={() => {
                    if (!window.location.href.includes("settings")) {
                      setSearch((c) => !c);
                      inputRef.current?.focus();
                    }
                  }}
                >
                  <MdSearch
                    size={18}
                    color={props.colors.navbar.buttons.color}
                  />
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
                    color={props.colors.navbar.buttons.color}
                    bg="transparent"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    ref={inputRef}
                    type="text"
                    width={search ? "200px" : "0px"}
                  />
                </form>
              </Item>
            </>
          )}
          <Item>
            <Btn
              hc={props.colors.navbar.buttons.hover}
              onClick={props.minimize}
              style={{
                alignItems: "flex-end",
              }}
            >
              <RiSubtractFill
                size={16}
                color={props.colors.navbar.buttons.color}
              />
            </Btn>
          </Item>
          <Item>
            <Btn
              onClick={props.maximize}
              hc={props.colors.navbar.buttons.hover}
            >
              {resize ? (
                <RiCheckboxMultipleBlankLine
                  size={14}
                  color={props.colors.navbar.buttons.color}
                />
              ) : (
                <RiCheckboxBlankLine
                  size={14}
                  color={props.colors.navbar.buttons.color}
                />
              )}
            </Btn>
          </Item>
          <Item>
            <Btn onClick={props.close} hc="#f41d1d">
              <RiCloseFill
                size={16}
                color={props.colors.navbar.buttons.color}
              />
            </Btn>
          </Item>
        </Menu>
      </Container>
    );
  }
);
