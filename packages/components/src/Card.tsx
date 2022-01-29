import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SpinnerDotted } from "spinners-react";
import { IoHeartSharp } from "react-icons/io5";
import { BaseTheme } from "types";
import { LazyImage } from "./LazyImage";
import { img404 } from "assets";

interface Props {
  title?: string;
  type: string;
  img: string;
  onClick?: () => void;
  pointer?: boolean;
  disabled?: boolean;
  colors: BaseTheme;
  options?: {
    favorite?: boolean;
    showFav?: boolean;
    setFavorite?: (fav: boolean) => void;
  };
}

export const Card: React.FC<Props> = ({ onClick, options, ...props }) => {
  const favRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [fav, setFav] = useState(false);
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!favRef.current?.contains(e.target as Node)) {
        onClick && onClick();
      } else {
        setFav(!!options?.favorite);
        options?.setFavorite && options.setFavorite(!options?.favorite);
      }
    },
    [onClick, options]
  );

  useEffect(() => {
    setFav(!!options?.favorite);

    const copy = cardRef.current;
    copy?.addEventListener("mousedown", handleClick);

    return () => {
      copy?.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick, options?.favorite]);

  return (
    <Container pointer={props.pointer} disabled={props.disabled} ref={cardRef}>
      {props.title && (
        <Badge top="2%" color="#fafafa" width="90%" left="0" br>
          <Txt style={{ padding: "0px 10px" }}>{props.title}</Txt>
        </Badge>
      )}
      {props.type && (
        <Badge
          top="10%"
          color={props.colors.secondary}
          width="40%"
          left="60%"
          bl
        >
          <Txt>{props.type}</Txt>
        </Badge>
      )}

      <LazyImage
        src={props.img}
        alt="card-image"
        imgWidth="100%"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = img404;
        }}
        Loading={() => (
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color={props.colors.secondary}
          />
        )}
        containerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "450px",
          width: "300px",
          position: "relative",
        }}
        loadingContainerStyle={{
          position: "absolute",
          top: "calc(50% - 50px)",
          left: "calc(50% - 50px)",
        }}
        imageStyle={{
          height: "100%",
          width: "100%",
        }}
      />

      {options && (
        <Badge
          color={props.colors.primary + "a0"}
          width="100%"
          heigth="30px"
          top="calc(100% - 30px)"
          left="0%"
          style={{ backdropFilter: "blur(2px)" }}
        >
          {options.showFav && (
            <div style={{ width: "100%", padding: "0px 10px" }}>
              <Fav ref={favRef}>
                {fav && (
                  <IoHeartSharp
                    color={props.colors.navbar.background}
                    size={28}
                  />
                )}
              </Fav>
            </div>
          )}
        </Badge>
      )}
    </Container>
  );
};

const Container = styled.div<{ pointer?: boolean; disabled?: boolean }>`
  position: relative;
  overflow: hidden;
  cursor: ${(p) => (p.pointer ? "pointer" : "default")};
  ${(p) =>
    !p.disabled &&
    `transition: transform 400ms ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }`};
  box-shadow: 4px 4px 9px -5px #000000;
  border-radius: 4px;
`;

const Badge = styled.div<{
  color: string;
  top: string;
  width: string;
  heigth?: string;
  left: string;
  bl?: boolean;
  br?: boolean;
}>`
  position: absolute;
  display: flex;
  height: ${(p) => p.heigth || "22px"};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.color};
  width: ${(p) => p.width};
  top: ${(p) => p.top};
  left: ${(p) => p.left};
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: ${(p) => (p.bl ? "1" : "0")}px solid black;
  border-right: ${(p) => (p.br ? "1" : "0")}px solid black;
  z-index: 11;
`;

const Txt = styled.p`
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  color: #000000;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Fav = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  z-index: 12;
  cursor: pointer;
  transition: transform 200ms ease-in-out;
  &:hover {
    transform: translateY(-2px);
  }
`;
