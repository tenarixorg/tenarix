import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { img404 } from "assets";
import { Theme } from "utils";

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
`;

const Badge = styled.div<{
  color: string;
  top: string;
  width: string;
  left: string;
  bl?: boolean;
  br?: boolean;
}>`
  position: absolute;
  display: flex;
  height: 22px;
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
  z-index: 3;
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

const Score = styled.div`
  position: absolute;
  top: calc(100% - 74px);
  left: calc(100% - 54px);
  background-color: #f41d1d;
  border: 1px solid black;
  height: 46px;
  width: 46px;
  border-radius: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Fav = styled.button`
  position: absolute;
  border: none;
  outline: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  top: 9%;
  left: 1%;
  z-index: 10;
  cursor: pointer;
  transition: transform 200ms ease-in-out;
  &:hover {
    transform: translateY(-2px);
  }
`;

interface Props {
  title?: string;
  type: string;
  demography?: string;
  score?: string;
  chapter?: string;
  img: string;
  onClick?: () => void;
  pointer?: boolean;
  disabled?: boolean;
  colors: Theme["dark"];
  favorite?: boolean;
  showFav?: boolean;
  setFavorite?: (fav: boolean) => void;
}

export const Card: React.FC<Props> = ({ onClick, setFavorite, ...props }) => {
  const favRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [fav, setFav] = useState(false);
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!favRef.current?.contains(e.target as Node)) {
        onClick && onClick();
      } else {
        setFav(!!props.favorite);
        setFavorite && setFavorite(!props.favorite);
      }
    },
    [favRef, onClick, setFavorite, props.favorite]
  );

  useEffect(() => {
    setFav(!!props.favorite);

    const copy = cardRef.current;
    copy?.addEventListener("mousedown", handleClick);

    return () => {
      copy?.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick, props.favorite]);

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
      <img
        src={props.img}
        alt="card-image"
        style={{
          width: "100%",
          height: "100%",
        }}
        draggable={false}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = img404;
        }}
      />
      {props.score && (
        <Score>
          <Txt>{props.score}</Txt>
        </Score>
      )}
      {props.demography && (
        <Badge
          top="calc(100% - 61px)"
          width="85%"
          left="0"
          color={props.colors.primary}
        >
          <Txt>{props.demography}</Txt>
        </Badge>
      )}
      {props.chapter && (
        <Badge
          top="calc(100% - 61px)"
          width="70%"
          br
          left="0"
          color={props.colors.primary}
        >
          <Txt>Capítulo: {props.chapter}</Txt>
        </Badge>
      )}
      {props.showFav && (
        <Fav ref={favRef}>
          {fav ? (
            <IoHeartSharp color={"red"} size={30} />
          ) : (
            <IoHeartOutline color={"red"} size={30} />
          )}
        </Fav>
      )}
    </Container>
  );
};
