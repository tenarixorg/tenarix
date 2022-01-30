import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Chapter as ChapterProps, ReadPercentage as IPercentage } from "types";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { SpinnerCircular } from "spinners-react";
import { BaseTheme } from "types";
import { RiPlayFill, RiDownloadCloudLine } from "react-icons/ri";
import { ReadPercentage } from "./ReadPercentage";

interface Props {
  chapter: ChapterProps;
  colors: BaseTheme;
  currentSource?: string;
  downloaded: (id: string) => boolean;
  downloading: (id: string) => boolean;
  handleDownload: (id: string) => void;
  handleRead: (id: string) => void;
  percentage: (id: string) => IPercentage;
  handlePercentage: (per: IPercentage) => void;
  onSourceChange: (id: string) => void;
}

export const Chapter: React.FC<Props> = ({ currentSource, ...props }) => {
  const [show, setShow] = useState(false);
  const mounted = useRef(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);

  const id_ = props.chapter.links[0].id;

  const handleModal = useCallback((e: MouseEvent) => {
    if (
      !modalRef.current?.contains(e.target as Node) &&
      !titleRef.current?.contains(e.target as Node)
    ) {
      if (mounted.current) setShow(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleModal);
    return () => {
      document.removeEventListener("click", handleModal);
    };
  }, [handleModal]);

  return (
    <Container>
      <Main width="100%">
        <Txt
          color={
            props.percentage(currentSource || id_).percetage < 100
              ? props.colors.fontPrimary
              : props.colors.fontPrimary + "a0"
          }
          wrap="true"
          style={{
            width: "fit-content",
          }}
          fs="18px"
          pointer
          bold
          ref={titleRef}
          onClick={() => {
            setShow((c) => !c);
          }}
        >
          {props.chapter.title}
        </Txt>
        <Main width="100px" style={{ marginRight: 10 }}>
          <Btn
            style={{
              width: "30px",
            }}
            onClick={() => {
              props.handlePercentage(props.percentage(currentSource || id_));
            }}
          >
            <ReadPercentage
              size={18}
              color={props.colors.secondary}
              bg={props.colors.fontSecondary}
              percentage={props.percentage(currentSource || id_).percetage}
              stroke="1px"
            />
          </Btn>
          <Btn
            onClick={() => {
              props.handleDownload(currentSource || id_);
            }}
            disabled={
              props.downloaded(currentSource || id_) ||
              props.downloading(currentSource || id_)
            }
          >
            {props.downloaded(currentSource || id_) ? (
              <BsFillCheckCircleFill color={props.colors.secondary} size={18} />
            ) : (
              <>
                {props.downloading(currentSource || id_) ? (
                  <SpinnerCircular
                    size={22}
                    color={props.colors.secondary}
                    thickness={140}
                  />
                ) : (
                  <RiDownloadCloudLine
                    color={props.colors.secondary}
                    size={22}
                  />
                )}
              </>
            )}
          </Btn>
          <Btn onClick={() => props.handleRead(currentSource || id_)}>
            <RiPlayFill color={props.colors.secondary} size={26} />
          </Btn>
        </Main>
      </Main>
      {show && (
        <Modal
          ref={modalRef}
          borderColor={props.colors.primary}
          bg={props.colors.background1}
        >
          {props.chapter.links.map((el, ii) => (
            <div
              key={ii}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Line
                  selectedColor={props.colors.secondary}
                  normalColor={props.colors.primary}
                  init={ii === 0}
                  selected={el.id === (currentSource || id_)}
                />
                <Txt
                  color={props.colors.fontPrimary}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShow(false);
                    props.onSourceChange(el.id);
                  }}
                  fs="15px"
                >
                  {el.src}
                </Txt>
              </div>
            </div>
          ))}
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Modal = styled.div<{ borderColor: string; bg: string }>`
  position: absolute;
  z-index: 8;
  background-color: ${(p) => p.bg + "f0"};
  box-shadow: 4px 4px 9px -5px #000000;
  backdrop-filter: blur(5px);
  border-radius: 4px;
  border-top-left-radius: 0px;
  top: 100%;
  width: fit-content;
  margin-left: 5px;
  border: 2px solid ${(p) => p.borderColor};
  padding: 1px 5px;
`;

const Main = styled.div<{ width: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${(p) => p.width};
  align-items: center;
`;

const Txt = styled.p<{
  pointer?: boolean;
  fs: string;
  bold?: boolean;
  wrap?: string;
  color: string;
}>`
  cursor: ${(p) => (p.pointer ? "pointer" : "default")};
  margin-bottom: 4px;
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
  color: ${(p) => p.color};
  ${(p) =>
    p.wrap
      ? `
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 60%;
  `
      : ""};
`;

const Line = styled.div<{
  init?: boolean;
  selected?: boolean;
  selectedColor: string;
  normalColor: string;
}>`
  position: relative;
  height: 100%;
  width: 16px;
  &::after {
    content: "";
    position: absolute;
    top: ${(p) => (p.init ? "-40%" : "-50%")};
    left: -7px;
    width: 2px;
    z-index: 2;
    height: calc(100% - ${(p) => (p.init ? "20%" : "0px")});
    background-color: ${(p) => p.normalColor};
  }

  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 3px);
    left: -5px;
    width: 18px;
    height: 4px;
    z-index: 1;
    background-color: ${(p) => (p.selected ? p.selectedColor : p.normalColor)};
  }
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
`;
