import React, { useState, useEffect, useRef, useCallback } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { BsChevronBarExpand } from "react-icons/bs";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import { Read as ReadT } from "types";
import { useParams } from "react-router-dom";
import { useTheme } from "context-providers";
import {
  BtnAni,
  Container,
  Loading,
  ReadImg,
  ReadNav,
  Txt,
  Btn,
} from "components/src/Elements";
import styled from "styled-components";

const CP = styled.div<{ rot?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  transition: transform 400ms ease-in-out;

  transform: rotate(${(p) => (p.rot ? "0" : "90")}deg);
`;

const { api } = window.bridge;

export const Read: React.FC = () => {
  const params = useParams();
  const mounted = useRef(false);
  const { colors } = useTheme();
  const [data, setData] = useState<ReadT>();
  const [img, setImg] = useState<any>();
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [remote, setRemote] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [localImgs, setLocalImgs] = useState<string[]>([]);

  const getNext = useCallback(() => {
    if (current <= 1) setCurrent(1);
    if (current >= (data?.pages || 1)) setCurrent(data?.pages || 1);
    if (data?.id)
      if (remote) {
        if (data.imgs.length > 0) {
          setLoading(true);
          const im = data.imgs[current - 1];
          if (im) {
            api.send("get:read:page", { img: im.url });
          }
        }
      } else {
        setLoading(true);
        if (localImgs.length > 0) {
          const im = localImgs[current - 1];
          if (im) {
            api.send("get:read:page", { img: im });
          }
        } else {
          api.send("get:read:local", {
            rid: params.id,
            root: params.route,
            id: data.id,
            page: current,
            total: data.pages,
          });
        }
      }
  }, [
    current,
    data?.pages,
    data?.id,
    remote,
    data?.imgs,
    params.id,
    params.route,
    localImgs,
  ]);

  useEffect(() => {
    api.on("res:read:local", (_e, res) => {
      if (typeof res === "boolean" && !res) {
        setRemote(true);
      } else {
        const imgs_: string[] = [];
        for (const buff of res) {
          const blob = new Blob([buff as Buffer]);
          const im = URL.createObjectURL(blob);
          imgs_.push(im);
        }
        if (mounted.current) {
          setLocalImgs(imgs_);
        }
      }
    });

    api.on("res:read:page", (_e, res) => {
      if (mounted.current) {
        setImg(res);
        setLoading(false);
      }
    });

    api.on("res:read:init", (_e, res) => {
      if (mounted.current) {
        setData(res);
        setLoading2(false);
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
    <Container
      padding="10px 0px 40px 0px"
      bg={colors.background1}
      scrollColor={colors.primary}
    >
      {!cascade && (
        <ReadNav>
          <BtnAni
            onClick={() => {
              setCurrent((c) => c - 1);
            }}
            disabled={loading || current <= 1}
          >
            <RiArrowLeftSLine size={60} color={colors.primary} />
          </BtnAni>
          <BtnAni
            right
            onClick={() => {
              setCurrent((c) => c + 1);
            }}
            disabled={loading || current >= (data?.pages || 1)}
          >
            <RiArrowRightSLine size={60} color={colors.primary} />
          </BtnAni>
        </ReadNav>
      )}
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
          <Txt margin="0px 0px 4px 0px" fs="30px" color={colors.fontPrimary}>
            {data?.title.substring(0, 50) +
              `${
                (data?.title || "").length >
                (data?.title || "").substring(0, 50).length
                  ? "..."
                  : ""
              }` || "Title"}
          </Txt>
          <Txt margin="0px 0px 4px 0px" fs="20px" color={colors.fontPrimary}>
            {data?.info.substring(0, data?.info.indexOf("S")) || data?.info}
            {cascade ? "" : " - " + current + "/" + data?.pages}
          </Txt>

          <Btn onClick={() => setCascade((c) => !c)}>
            <CP rot={cascade}>
              <BsChevronBarExpand color={colors.primary} size={30} />
            </CP>
          </Btn>
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
        <>
          {remote ? (
            <>
              {cascade && data?.imgs && data.imgs.length > 0 ? (
                data?.imgs.map((im, ix) => (
                  <ReadImg
                    src={im.url}
                    key={ix}
                    alt="img"
                    draggable={false}
                    onLoad={() => {
                      console.log("loaded");
                    }}
                  />
                ))
              ) : (
                <ReadImg src={img} alt="img" draggable={false} />
              )}
            </>
          ) : (
            <>
              {cascade && localImgs.length > 0 ? (
                localImgs.map((im, ix) => (
                  <ReadImg
                    src={im}
                    key={ix}
                    alt="img"
                    draggable={false}
                    onLoad={() => {
                      console.log("loaded");
                    }}
                  />
                ))
              ) : (
                <ReadImg src={img} alt="img" draggable={false} />
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};
