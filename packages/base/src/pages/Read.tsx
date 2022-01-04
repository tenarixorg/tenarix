import React, { useState, useEffect, useRef, useCallback } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import { Read as ReadT } from "types";
import { useParams } from "react-router-dom";
import { useTheme } from "utils";
import {
  BtnAni,
  Container,
  Loading,
  ReadImg,
  ReadNav,
  Txt,
} from "components/src/Elements";

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
    <Container
      padding="10px 0px 40px 0px"
      bg={colors.background1}
      scrollColor={colors.primary}
    >
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
        <ReadImg src={img} alt="img" draggable={false} />
      )}
    </Container>
  );
};
