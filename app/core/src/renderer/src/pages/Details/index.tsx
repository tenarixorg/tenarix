import React, { useCallback, useEffect, useReducer, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Chapter, Status, GenderBadge, Card, NoInternet } from "components";
import { BsSortNumericDown, BsSortNumericUpAlt } from "react-icons/bs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { getSource, initialState, reducer } from "./helper";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { CustomScrollbarsVirtualList } from "./CustomScroll";
import { useLang, useTheme } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import { FixedSizeList } from "react-window";
import {
  Btn,
  Txt,
  Fav,
  Main,
  Info,
  Loading,
  CardInfo,
  Container,
  Description,
  InfoContainer,
  ChaptersHeader,
  GenderContainer,
  ChaptersContainer,
} from "components/src/Elements";

const { api } = window.bridge;

export const Details: React.FC = () => {
  const mounted = useRef(false);
  const navigation = useNavigate();
  const params = useParams();
  const { colors } = useTheme();
  const { lang } = useLang();
  const { state: URLstate } = useLocation();
  const [
    {
      show,
      order,
      data,
      loading,
      fav,
      downs,
      ids,
      reverse,
      percentages,
      sources,
      height,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const resize = useCallback(() => {
    if (mounted.current) {
      dispatch({ type: "setHeight", payload: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    api.on("res:details", (_e, { res, fav }) => {
      if (mounted.current) {
        dispatch({ type: "setData", payload: res });
        dispatch({ type: "setFav", payload: fav });
        dispatch({ type: "setLoading", payload: false });
      }
    });
    api.on("res:downloaded", (_e, res) => {
      if (mounted.current) dispatch({ type: "setDowns", payload: res });
    });
    api.on("res:favorite", (_e, res) => {
      if (mounted.current) dispatch({ type: "setFav", payload: res });
    });
    api.on("res:read:percentage", (_e, res) => {
      if (mounted.current) dispatch({ type: "setPercentages", payload: res });
    });
    api.on("res:current:chapters:sources", (_e, res) => {
      if (mounted.current) dispatch({ type: "setSources", payload: res });
    });
    api.send("get:details", {
      route: params.route,
      ext: (URLstate as any)?.ext || "",
    });
    api.send("get:downloaded", {
      ext: (URLstate as any)?.ext || "",
    });
    api.send("get:read:percentage", {
      ext: (URLstate as any)?.ext || "",
      route: params.route,
    });
    api.send("get:current:chapters:sources", {
      ext: (URLstate as any)?.ext || "",
      route: params.route,
    });
    return () => {
      api.removeAllListeners("res:details");
      api.removeAllListeners("res:downloaded");
      api.removeAllListeners("res:favorite");
      api.removeAllListeners("res:read:percentage");
      api.removeAllListeners("res:current:chapters:sources");
      mounted.current = false;
    };
  }, [params.route, URLstate]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return (
    <Container bg={colors.background1} scrollColor={colors.primary}>
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
          {data ? (
            <>
              <InfoContainer>
                <Fav
                  onClick={() => {
                    if (!fav) {
                      api.send("set:favorite", { route: params.route, data });
                    } else {
                      api.send("remove:favorite", {
                        route: params.route,
                        ext: (URLstate as any)?.ext || "",
                      });
                    }
                  }}
                >
                  {fav ? (
                    <IoHeartSharp color={"red"} size={30} />
                  ) : (
                    <IoHeartOutline color={"red"} size={30} />
                  )}
                </Fav>
                <CardInfo>
                  <Card
                    colors={colors}
                    disabled
                    img={data.img}
                    type={data.type}
                  />
                </CardInfo>
                <Info>
                  <Txt
                    margin="0px 0px 4px 0px"
                    fs="35px"
                    bold
                    color={colors.fontPrimary}
                    style={{
                      width: "95%",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {data.title}
                  </Txt>
                  <Description
                    fs="16px"
                    margin="20px 0px 10px 0px"
                    color={colors.fontSecondary}
                  >
                    {data.description}
                  </Description>

                  {data.genres.length > 0 && (
                    <Txt
                      fs="24px"
                      bold
                      margin="0px 0px 4px 0px"
                      color={colors.fontSecondary}
                      style={{ margin: "20px 0px 10px 0px" }}
                    >
                      {lang.details.genders}
                    </Txt>
                  )}
                  <GenderContainer>
                    {data.genres.map((e, i) => (
                      <GenderBadge colors={colors} text={e} key={i + e} />
                    ))}
                  </GenderContainer>
                  <Txt
                    fs="24px"
                    bold
                    margin="0px 0px 4px 0px"
                    color={colors.fontSecondary}
                    style={{ margin: "20px 0px 10px 0px" }}
                  >
                    {lang.details.status}
                  </Txt>
                  <Status colors={colors} state={data.status} />
                </Info>
              </InfoContainer>
              <ChaptersHeader bg={colors.background1}>
                <Txt
                  color={colors.fontPrimary}
                  pointer
                  fs="25px"
                  margin="0px 0px 4px 0px"
                  bold
                  onClick={() => dispatch({ type: "toggleShow" })}
                >
                  {lang.details.chapters}
                </Txt>
                <Main width="70px">
                  <Btn
                    onClick={() => {
                      dispatch({ type: "toggleOrder" });
                      dispatch({ type: "reverseChapter" });
                    }}
                  >
                    {!order ? (
                      <BsSortNumericDown color={colors.secondary} size={25} />
                    ) : (
                      <BsSortNumericUpAlt color={colors.secondary} size={25} />
                    )}
                  </Btn>
                  <Btn onClick={() => dispatch({ type: "toggleShow" })}>
                    {show ? (
                      <RiArrowUpSLine color={colors.secondary} size={30} />
                    ) : (
                      <RiArrowDownSLine color={colors.secondary} size={30} />
                    )}
                  </Btn>
                </Main>
              </ChaptersHeader>
              {show && (
                <ChaptersContainer bg={colors.background1}>
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <FixedSizeList
                        itemCount={data?.chapters.length}
                        width={width}
                        height={height - 450 < 400 ? 400 : height - 450}
                        itemSize={40}
                        outerElementType={CustomScrollbarsVirtualList}
                      >
                        {({ index, style }) => (
                          <div style={style}>
                            <Chapter
                              colors={colors}
                              chapter={data?.chapters[index]}
                              currentSource={getSource(
                                sources,
                                data?.chapters[index].title
                              )}
                              percentage={(curr) => {
                                const notFound = {
                                  id: curr,
                                  percetage: 0,
                                };
                                const per = percentages.find(
                                  (u) => u.id === curr
                                );
                                return per ? per : notFound;
                              }}
                              handlePercentage={(per) => {
                                if (per.percetage < 100) {
                                  api.send("set:read:percentage", {
                                    route: params.route,
                                    ext: (URLstate as any)?.ext || "",
                                    id: per.id,
                                    percentage: 100,
                                    page: -1,
                                  });
                                } else {
                                  api.send("set:read:percentage", {
                                    route: params.route,
                                    ext: (URLstate as any)?.ext || "",
                                    id: per.id,
                                    percentage: 0,
                                    page: 1,
                                  });
                                }
                              }}
                              handleDownload={(rid) => {
                                api.on("res:read:init", (_e, res) => {
                                  api.removeAllListeners("res:read:init");
                                  api.send("download", {
                                    rid,
                                    root: params.route,
                                    id: res?.id,
                                    imgs: res?.imgs,
                                    title: res?.title,
                                    pages: res?.pages,
                                    info: res?.info,
                                    ext: (URLstate as any)?.ext || "",
                                  });
                                });
                                api.send("get:read:init", {
                                  id: rid,
                                  ext: (URLstate as any)?.ext || "",
                                });
                              }}
                              downloaded={(curr) =>
                                !!downs.find(
                                  (u) =>
                                    curr !== "" && u.data.rid === curr && u.done
                                )
                              }
                              downloading={(curr) =>
                                !!downs.find(
                                  (u) =>
                                    curr !== "" &&
                                    u.data.rid === curr &&
                                    u.inProgress
                                )
                              }
                              onSourceChange={(id_) => {
                                api.send("set:current:chapter:source", {
                                  ext: (URLstate as any)?.ext,
                                  route: params.route,
                                  chapter: data.chapters[index].title,
                                  current: id_,
                                });
                              }}
                              handleRead={(id) => {
                                navigation(`/read/${params.route}/${id}`, {
                                  state: {
                                    ext: (URLstate as any)?.ext || "",
                                    chapters: ids,
                                    reverse,
                                    cascade: false,
                                  },
                                });
                              }}
                            />
                          </div>
                        )}
                      </FixedSizeList>
                    )}
                  </AutoSizer>
                </ChaptersContainer>
              )}
            </>
          ) : (
            <NoInternet
              color={colors.fontSecondary}
              iconColor={colors.navbar.background}
              msg={"No Internet Connection"}
            />
          )}
        </>
      )}
    </Container>
  );
};
