import React, { useEffect, useRef, useCallback, useReducer } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import { useParams, useLocation } from "react-router-dom";
import { initialState, reducer } from "./helper";
import { BsChevronBarExpand } from "react-icons/bs";
import { useTheme } from "context-providers";
import {
  BtnAni,
  Container,
  Loading,
  ReadImg,
  ReadNav,
  Txt,
  Btn,
  CP,
} from "components/src/Elements";

const { api } = window.bridge;

export const Read: React.FC = () => {
  const params = useParams();
  const mounted = useRef(false);
  const { colors } = useTheme();
  const { state: URLstate } = useLocation();
  const [
    { remote, loading2, loading, img, cascade, current, data, localImgs },
    dispatch,
  ] = useReducer(reducer, initialState);

  const getNext = useCallback(() => {
    if (current <= 1) dispatch({ type: "setCurrent", payload: 1 });
    if (current >= data.pages)
      dispatch({ type: "setCurrent", payload: data.pages });
    if (data.id)
      if (remote) {
        if (data.imgs.length > 0) {
          dispatch({ type: "setLoading", payload: true });
          const im = data.imgs[current - 1];
          if (im) {
            api.send("get:read:page", { img: im.url });
          }
        }
      } else {
        dispatch({ type: "setLoading", payload: true });
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
    params.id,
    params.route,
    data.pages,
    current,
    data.id,
    data.imgs,
    remote,
    localImgs,
  ]);

  useEffect(() => {
    api.on("res:read:local", (_e, res) => {
      if (typeof res === "boolean" && !res) {
        dispatch({ type: "setRemote", payload: true });
      } else {
        const imgs_: string[] = [];
        for (const buff of res) {
          const blob = new Blob([buff as Buffer]);
          const im = URL.createObjectURL(blob);
          imgs_.push(im);
        }
        if (mounted.current) {
          dispatch({ type: "setLocalImgs", payload: imgs_ });
        }
      }
    });

    api.on("res:read:page", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setImg", payload: res });
        dispatch({ type: "setLoading", payload: false });
      }
    });

    api.on("res:read:init", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setData", payload: res });
        dispatch({ type: "setLoading2", payload: false });
      }
    });

    api.send("get:read:init", {
      id: params.id,
      ext: (URLstate as any)?.ext || "",
    });

    mounted.current = true;
    return () => {
      mounted.current = false;
      api.removeAllListeners("res:read:init");
      api.removeAllListeners("res:read:page");
      api.removeAllListeners("res:read:local");
    };
  }, [params.id, URLstate]);

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
              dispatch({ type: "decrementCurrent", payload: 1 });
            }}
            disabled={loading || current <= 1}
          >
            <RiArrowLeftSLine size={60} color={colors.primary} />
          </BtnAni>
          <BtnAni
            right
            onClick={() => {
              dispatch({ type: "incrementCurrent", payload: 1 });
            }}
            disabled={loading || current >= data.pages}
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
            {data.title.substring(0, 50) +
              `${
                (data.title || "").length >
                (data.title || "").substring(0, 50).length
                  ? "..."
                  : ""
              }` || "Title"}
          </Txt>
          <Txt margin="0px 0px 4px 0px" fs="20px" color={colors.fontPrimary}>
            {data.info.substring(0, data.info.indexOf("S")) || data.info}
            {cascade ? "" : " - " + current + "/" + data.pages}
          </Txt>

          <Btn onClick={() => dispatch({ type: "setCascade" })}>
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
              {cascade && data.imgs && data.imgs.length > 0 ? (
                data.imgs.map((im, ix) => (
                  <ReadImg src={im.url} key={ix} alt="img" draggable={false} />
                ))
              ) : (
                <ReadImg src={img} alt="img" draggable={false} />
              )}
            </>
          ) : (
            <>
              {cascade && localImgs.length > 0 ? (
                localImgs.map((im, ix) => (
                  <ReadImg src={im} key={ix} alt="img" draggable={false} />
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
