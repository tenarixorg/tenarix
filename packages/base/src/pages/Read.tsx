import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import { Read as ReadT } from "types";
import { useParams } from "react-router-dom";
import { useTheme } from "utils";

const { api } = window.bridge;

const Container = styled.div<{ bg: string; scrollColor: string }>`
  background-color: ${(p) => p.bg};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  padding: 10px 0px 40px 0px;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollColor};
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollColor};
  }
  img {
    width: 80%;
    margin-top: 10px;
  }
`;

const Txt = styled.p<{
  fs: string;
  bold?: boolean;
  color: string;
}>`
  margin-bottom: 4px;
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
  color: ${(p) => p.color};
`;

const Btn = styled.button<{ right?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  transition: transform 400ms ease-in-out;
  &:hover {
    transform: translateX(${(p) => (p.right ? "5px" : "-5px")});
  }
`;

const Nav = styled.div`
  position: sticky;
  top: calc(50% - 22px);
  left: 0;
  width: 92%;
  height: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Loading = styled.div`
  position: absolute;
  top: calc(50% - 90px);
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Read: React.FC = () => {
  const params = useParams();
  const [data, setData] = useState<ReadT>();
  const [img, setImg] = useState<any>();
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [remote, setRemote] = useState(false);

  const { colors } = useTheme();

  const mounted = useRef(false);

  const getNext = useCallback(() => {
    if (current <= 1) setCurrent(1);
    if (current >= (data?.pages || 1)) setCurrent(data?.pages || 1);
    if (data?.id)
      if (remote) {
        if (data.imgs.length > 0) {
          const im = data.imgs[current - 1];
          if (im) {
            setLoading(true);
            api.send("get:read:page", { img: im });
          }
        }
      } else {
        setLoading(true);
        api.send("get:read:local", {
          rid: params.id,
          root: params.route,
          id: data.id,
          page: current,
          total: data.pages,
        });
      }
  }, [
    current,
    data?.pages,
    data?.id,
    remote,
    data?.imgs,
    params.id,
    params.route,
  ]);

  useEffect(() => {
    api.on("res:read:local", (_e, buff) => {
      if (typeof buff === "boolean" && !buff) {
        setRemote(true);
      } else {
        const blob = new Blob([buff as Buffer]);
        const im = URL.createObjectURL(blob);
        if (mounted.current) {
          setImg(im);
          setLoading(false);
        }
      }
    });

    api.on("res:read:init", (_e, res) => {
      if (mounted.current) {
        setData(res);
        setLoading2(false);
      }
    });

    api.on("res:read:page", async (_e, buff) => {
      if (typeof buff === "string") {
        if (mounted.current) {
          setImg(buff);
          setLoading(false);
        }
      } else {
        const blob = new Blob([buff as Buffer]);
        const im = URL.createObjectURL(blob);
        if (mounted.current) {
          setImg(im);
          setLoading(false);
        }
      }
    });

    api.send("get:read:init", { id: params.id });

    mounted.current = true;
    return () => {
      mounted.current = false;
      api.removeAllListeners("res:read:init");
      api.removeAllListeners("res:read:page");
      api.removeAllListeners("res:read:local");
    };
  }, [params.id]);
  useEffect(() => {
    getNext();
  }, [getNext]);

  return (
    <Container bg={colors.background1} scrollColor={colors.primary}>
      <Nav>
        <Btn
          onClick={() => {
            setCurrent((c) => c - 1);
          }}
          disabled={loading || current <= 1}
        >
          <RiArrowLeftSLine size={60} color={colors.primary} />
        </Btn>
        <Btn
          right
          onClick={() => {
            setCurrent((c) => c + 1);
          }}
          disabled={loading || current >= (data?.pages || 1)}
        >
          <RiArrowRightSLine size={60} color={colors.primary} />
        </Btn>
      </Nav>
      {loading2 ? (
        <SpinnerInfinity
          size={80}
          thickness={100}
          speed={100}
          style={{
            marginTop: 20,
          }}
          color={colors.secondary}
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      ) : (
        <>
          <Txt fs="30px" color={colors.fontPrimary} style={{}}>
            {data?.title.substring(0, 50) +
              `${
                (data?.title || "").length >
                (data?.title || "").substring(0, 50).length
                  ? "..."
                  : ""
              }` || "Title"}
          </Txt>
          <Txt fs="20px" color={colors.fontPrimary}>
            {data?.info.substring(0, data?.info.indexOf("S")) || data?.info}
            {" - " + current + "/" + data?.pages}
          </Txt>
        </>
      )}
      {loading ? (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color={colors.secondary}
          />
        </Loading>
      ) : (
        <img src={img} alt="img" draggable={false} />
      )}
    </Container>
  );
};
