import React, { useState, useEffect } from "react";
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
}>`
  cursor: ${(p) => (p.pointer ? "pointer" : "default")};
  margin-bottom: 4px;
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
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
  dowload: (
    rid: string
  ) => Promise<{ id: string; root: string; total: number }>;
}

const { api } = window.bridge;

export const Chapter: React.FC<Props> = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.on("download:done", () => {
      setLoading(false);
    });
    return () => {
      api.removeAllListeners("download:done");
    };
  }, []);
  return (
    <Container>
      <Main width="100%">
        <Txt
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
            onClick={async () => {
              setLoading(true);
              const rid = props.chapter.links[0].id;
              const data = await props.dowload(rid);
              api.send("download", { rid, ...data });
            }}
            disabled={loading}
          >
            {loading ? (
              <SpinnerCircular size={22} color="#e83588" thickness={140} />
            ) : (
              <RiDownloadCloudLine color="#e83588" size={22} />
            )}
          </Btn>
          <Btn onClick={() => props.handler(props.chapter.links[0].id)}>
            <RiPlayFill color="#e83588" size={25} />
          </Btn>
          <Btn onClick={() => setShow((c) => !c)}>
            {show ? (
              <RiArrowUpSLine color="#e83588" size={30} />
            ) : (
              <RiArrowDownSLine color="#e83588" size={30} />
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
                <Txt fs="15px">{el.src}</Txt>
              </div>
              <Btn onClick={() => props.handler(el.id)}>
                <RiPlayCircleFill
                  color="#e83588"
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
