import React, { useState } from "react";
import styled from "styled-components";
import { Chapter as ChapterProps } from "types";
import {
  RiPlayCircleFill,
  RiPlayFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDownloadCloudLine,
} from "react-icons/ri";
import { SpinnerCircular } from "spinners-react";
import { Theme } from "utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
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

const Line = styled.div<{ init?: boolean }>`
  position: relative;
  height: 100%;
  width: 16px;
  margin-left: 5px;
  margin-right: 2px;
  &::after {
    content: "";
    position: absolute;
    top: ${(p) => (p.init ? "-30%" : "-50%")};
    left: 0;
    width: 2px;
    height: calc(100% - ${(p) => (p.init ? "20%" : "0px")});
    background-color: #146def;
  }

  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 2px);
    left: 0;
    width: 15px;
    height: 2px;
    background-color: #146def;
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

interface Props {
  chapter: ChapterProps;
  handler: (id: string) => void;
  root: string;
  colors: Theme["dark"];
}

const { api } = window.bridge;

export const Chapter: React.FC<Props> = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const id_ = props.chapter.links[0].id;

  return (
    <Container>
      <Main width="100%">
        <Txt
          color={props.colors.fontPrimary}
          wrap="true"
          fs="18px"
          pointer
          bold
          onClick={() => setShow((c) => !c)}
        >
          {props.chapter.title}
        </Txt>
        <Main width="110px">
          <Btn
            onClick={() => {
              api.on("res:read:init", (_e, res) => {
                api.removeAllListeners("res:read:init");
                api.send("download", {
                  rid: id_,
                  root: props.root,
                  id: res.id,
                  imgs: res.imgs,
                });
              });
              api.on("download:done", () => {
                setLoading(false);
                api.removeAllListeners("download:done");
              });
              setLoading(true);
              api.send("get:read:init", { id: id_ });
            }}
            disabled={loading}
          >
            {loading ? (
              <SpinnerCircular
                size={22}
                color={props.colors.secondary}
                thickness={140}
              />
            ) : (
              <RiDownloadCloudLine color={props.colors.secondary} size={22} />
            )}
          </Btn>
          <Btn onClick={() => props.handler(props.chapter.links[0].id)}>
            <RiPlayFill color={props.colors.secondary} size={25} />
          </Btn>
          <Btn onClick={() => setShow((c) => !c)}>
            {show ? (
              <RiArrowUpSLine color={props.colors.secondary} size={30} />
            ) : (
              <RiArrowDownSLine color={props.colors.secondary} size={30} />
            )}
          </Btn>
        </Main>
      </Main>
      {show && (
        <div>
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
                <Line init={ii === 0} />
                <Txt color={props.colors.fontPrimary} fs="15px">
                  {el.src}
                </Txt>
              </div>
              <Btn onClick={() => props.handler(el.id)}>
                <RiPlayCircleFill
                  color={props.colors.secondary}
                  size={22}
                  style={{ marginRight: 45 }}
                />
              </Btn>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};
