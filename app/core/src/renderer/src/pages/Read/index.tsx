import React, { useEffect, useRef, useCallback, useReducer } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { initialState, nextChapter, reducer } from "./helper";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import { LazyImage, ReadPagination } from "components";
import { BsChevronBarExpand } from "react-icons/bs";
import { useTheme } from "context-providers";
import { Wrapper } from "./Util";
import {
  CP,
  Txt,
  Btn,
  BtnAni,
  ReadNav,
  Loading,
  Container,
} from "components/src/Elements";

const { api } = window.bridge;

export const Read: React.FC = () => {
  const params = useParams();
  const mounted = useRef(false);
  const contRef = useRef<HTMLDivElement | null>(null);
  const navigation = useNavigate();
  const { colors } = useTheme();
  const { state: URLstate } = useLocation();
  const [
    {
      ids,
      img,
      data,
      remote,
      loading,
      cascade,
      current,
      reverse,
      loading2,
      localImgs,
      chapterIndex,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const getNextChapter = useCallback(() => {
    const ext_ = (URLstate as any)?.ext || "";
    nextChapter(
      reverse,
      current,
      chapterIndex,
      data.pages,
      ids,
      ext_,
      params.route || "",
      navigation,
      () => {
        dispatch({ type: "reset" });
      }
    );
  }, [
    ids,
    current,
    reverse,
    URLstate,
    data.pages,
    navigation,
    chapterIndex,
    params.route,
  ]);

  const getNextPage = useCallback(() => {
    if (current < 1) {
      dispatch({ type: "setCurrent", payload: 1 });
    }

    if (current > data.pages && data.pages > 0) {
      dispatch({ type: "setCurrent", payload: data.pages });
    }
    if (data.id) {
      if (remote) {
        if (data.imgs && data.imgs.length > 0) {
          dispatch({ type: "setLoading", payload: true });
          const im = data.imgs[current - 1];
          if (im) {
            api.send("get:read:page", {
              img: im.url,
              page: current,
              total: data.pages,
              ext: (URLstate as any)?.ext || "",
              route: params.route,
              id: params.id,
            });
          }
        }
      } else {
        dispatch({ type: "setLoading", payload: true });
        if (localImgs.length > 0) {
          const im = localImgs[current - 1];
          if (im) {
            api.send("get:read:page", {
              img: im,
              page: current,
              total: data.pages,
              ext: (URLstate as any)?.ext || "",
              route: params.route,
              id: params.id,
            });
          }
        } else {
          api.send("get:read:local", {
            rid: params.id,
            root: params.route,
            id: data.id,
            page: current,
            total: data.pages,
            ext: (URLstate as any)?.ext || "",
          });
        }
      }
    }
  }, [
    remote,
    data.id,
    current,
    URLstate,
    params.id,
    localImgs,
    data.imgs,
    data.pages,
    params.route,
  ]);

  const observeCascadeImgs = useCallback(() => {
    if (cascade) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const page_ = entry.target.getAttribute("data-saved");
              let page = 1;
              if (page_) {
                page = parseInt(page_);
              }
              api.send("set:read:percentage", {
                route: params.route,
                id: params.id,
                ext: (URLstate as any)?.ext,
                percentage: (page / data.pages) * 100,
                page,
                check: true,
              });
            }
          }
        },
        {
          threshold: 0.1,
        }
      );

      const imgs_ = document.querySelectorAll(".percentage-image");
      for (const img_ of imgs_) {
        observer.observe(img_);
      }
    }
  }, [cascade, data.pages, URLstate, params.id, params.route]);

  const handleDirectionkey = useCallback(
    (direction?: "left" | "right") => {
      if (cascade) {
        const ext_ = (URLstate as any)?.ext || "";
        nextChapter(
          reverse,
          current,
          chapterIndex,
          data.pages,
          ids,
          ext_,
          params.route || "",
          navigation,
          () => {
            dispatch({ type: "reset" });
          },
          true,
          direction
        );
      } else {
        if (direction === "left") {
          dispatch({ type: "decrementCurrent", payload: 1 });
        }
        if (direction === "right") {
          dispatch({ type: "incrementCurrent", payload: 1 });
        }
      }
    },
    [
      current,
      cascade,
      data.pages,
      URLstate,
      params.route,
      chapterIndex,
      ids,
      navigation,
      reverse,
    ]
  );

  const handleKeysDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleDirectionkey("left");
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleDirectionkey("right");
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        contRef.current?.scrollBy(0, -100);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        contRef.current?.scrollBy(0, 100);
      }
      if (e.ctrlKey && e.key === " ") {
        e.preventDefault();
        dispatch({ type: "toggleCascade" });
        contRef.current?.scrollTo(0, 0);
      }
    },
    [handleDirectionkey]
  );

  useEffect(() => {
    const chaps = (URLstate as any)?.chapters;
    const rever = (URLstate as any)?.reverse;
    const casc = (URLstate as any)?.cascade;

    api.on("res:read:local", (_e, res) => {
      if (typeof res === "boolean" && !res) {
        dispatch({ type: "setRemote", payload: true });
      } else {
        if (mounted.current) {
          dispatch({ type: "setLocalImgs", payload: res });
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
        api.on("res:read:percentage:page", (_e, res) => {
          const n = res === -1 ? res.pages : res;
          dispatch({ type: "setCurrent", payload: n });
        });
        api.send("get:read:percentage:page", {
          route: params.route,
          ext: (URLstate as any)?.ext || "",
          id: params.id,
        });
      }
    });

    if (chaps) {
      dispatch({ type: "setIds", payload: chaps });
      dispatch({ type: "setChapterIndex", payload: chaps.indexOf(params.id) });
    }
    dispatch({ type: "setReverse", payload: !!rever });
    dispatch({ type: "setCascade", payload: !!casc });

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
  }, [params.id, URLstate, params.route]);

  useEffect(() => {
    getNextPage();
  }, [getNextPage]);

  useEffect(() => {
    getNextChapter();
  }, [getNextChapter]);

  useEffect(() => {
    observeCascadeImgs();
  }, [observeCascadeImgs]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeysDown);
    return () => {
      document.removeEventListener("keydown", handleKeysDown);
    };
  }, [handleKeysDown]);

  useEffect(() => {
    api.send("get:read:percentage:page", {
      route: params.route,
      ext: (URLstate as any)?.ext || "",
      id: params.id,
    });
    const timer = setTimeout(() => {
      if (cascade && current > 1) {
        const img__ = document.querySelector("[data-saved='" + current + "']");
        if (img__) {
          img__.scrollIntoView();
        }
      }
    }, 100);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cascade, params.id, params.route, URLstate]);

  return (
    <Container
      padding="10px 0px 40px 0px"
      bg={colors.background1}
      scrollColor={colors.primary}
      ref={contRef}
    >
      <ReadNav>
        <BtnAni
          onClick={() => {
            handleDirectionkey("left");
          }}
          disabled={loading || loading2}
        >
          <RiArrowLeftSLine size={60} color={colors.primary} />
        </BtnAni>
        <BtnAni
          right
          onClick={() => {
            handleDirectionkey("right");
          }}
          disabled={loading || loading2}
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
            {data.title.substring(0, 50) +
              `${
                (data.title || "").length >
                (data.title || "").substring(0, 50).length
                  ? "..."
                  : ""
              }` || "Title"}
          </Txt>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Txt margin="0px 40px 0px 0px" fs="20px" color={colors.fontPrimary}>
              {data.info}
            </Txt>
            {!cascade && (
              <ReadPagination
                selectedItemColor={colors.secondary}
                listScrollColor={colors.primary}
                listBg={colors.background2}
                max={data.pages}
                min={1}
                value={current}
                color={colors.fontPrimary}
                listColor={colors.fontPrimary}
                fs="20px"
                onChange={(n) => {
                  dispatch({ type: "setCurrent", payload: n });
                }}
              />
            )}
          </div>

          <Btn
            onClick={() => dispatch({ type: "toggleCascade" })}
            style={{ margin: "10px 0px" }}
          >
            <CP rot={cascade}>
              <BsChevronBarExpand color={colors.primary} size={30} />
            </CP>
          </Btn>
        </>
      )}
      {loading || loading2 ? (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color={colors.secondary}
          />
        </Loading>
      ) : (
        <div
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Wrapper>
            {remote ? (
              <>
                {cascade && data.imgs && data.imgs.length > 0 ? (
                  <>
                    {data.imgs.map((im, ix) => (
                      <LazyImage
                        indicator
                        indicatorColors={{
                          txt: colors.fontPrimary,
                          bg: colors.background1,
                        }}
                        key={ix}
                        className="percentage-image"
                        data={ix + 1}
                        src={im.url}
                        alt="img"
                        imgWidth={"80vw"}
                        containerStyle={{
                          position: "relative",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        loadingContainerStyle={{
                          width: "100%",
                          height: "70vh",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        Loading={() => (
                          <SpinnerDotted
                            size={100}
                            thickness={180}
                            speed={100}
                            color={colors.secondary}
                          />
                        )}
                      />
                    ))}
                  </>
                ) : (
                  <LazyImage
                    indicator
                    indicatorColors={{
                      txt: colors.fontPrimary,
                      bg: colors.background1,
                    }}
                    src={img}
                    alt="img"
                    data={current}
                    imgWidth={"80vw"}
                    containerStyle={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    loadingContainerStyle={{
                      width: "100%",
                      height: "70vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    Loading={() => (
                      <SpinnerDotted
                        size={100}
                        thickness={180}
                        speed={100}
                        color={colors.secondary}
                      />
                    )}
                  />
                )}
              </>
            ) : (
              <>
                {cascade && localImgs.length > 0 ? (
                  <>
                    {localImgs.map((im, ix) => (
                      <LazyImage
                        indicator
                        indicatorColors={{
                          txt: colors.fontPrimary,
                          bg: colors.background1,
                        }}
                        key={ix}
                        src={im}
                        className="percentage-image"
                        data={ix + 1}
                        alt="img"
                        imgWidth={"80vw"}
                        containerStyle={{
                          position: "relative",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        loadingContainerStyle={{
                          width: "100%",
                          height: "70vh",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        Loading={() => (
                          <SpinnerDotted
                            size={100}
                            thickness={180}
                            speed={100}
                            color={colors.secondary}
                          />
                        )}
                      />
                    ))}
                  </>
                ) : (
                  <LazyImage
                    indicator
                    indicatorColors={{
                      txt: colors.fontPrimary,
                      bg: colors.background1,
                    }}
                    src={img}
                    alt="img"
                    data={current}
                    imgWidth={"80vw"}
                    containerStyle={{
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    loadingContainerStyle={{
                      width: "100%",
                      height: "70vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    Loading={() => (
                      <SpinnerDotted
                        size={100}
                        thickness={180}
                        speed={100}
                        color={colors.secondary}
                      />
                    )}
                  />
                )}
              </>
            )}
          </Wrapper>
        </div>
      )}
    </Container>
  );
};
