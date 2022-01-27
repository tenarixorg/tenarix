import React, { useCallback, useEffect, useReducer, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { BsSortNumericDown, BsSortNumericUpAlt } from "react-icons/bs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Chapter, Status, GenderBadge, Card } from "components";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { initialState, reducer } from "./helper";
import { useLang, useTheme } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import { FixedSizeList } from "react-window";
import {
  Btn,
  Txt,
  Main,
  Info,
  Loading,
  CardInfo,
  Container,
  CustomScroll,
  InfoContainer,
  ChaptersHeader,
  GenderContainer,
  ChaptersContainer,
  Description,
} from "components/src/Elements";

const { api } = window.bridge;

const CustomScrollbars: React.FC<{
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  forwardedRef?: any;
  style?: React.CSSProperties;
}> = ({ onScroll, forwardedRef, style, children }) => {
  const { colors } = useTheme();

  const refSetter = useCallback(
    (scrollbarsRef) => {
      if (scrollbarsRef) {
        forwardedRef(scrollbarsRef.view);
      } else {
        forwardedRef(null);
      }
    },
    [forwardedRef]
  );

  return (
    <CustomScroll
      ref={refSetter}
      scrollColor={colors.secondary}
      style={{
        ...style,
      }}
      onScroll={onScroll}
    >
      {children}
    </CustomScroll>
  );
};

const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref} />
));

export const Details: React.FC = () => {
  const mounted = useRef(false);
  const navigation = useNavigate();
  const params = useParams();
  const { colors } = useTheme();
  const { lang } = useLang();
  const { state: URLstate } = useLocation();
  const [
    { show, order, data, loading, fav, downs, ids, reverse, percentages },
    dispatch,
  ] = useReducer(reducer, initialState);

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
    api.on("res:read:percentage", (_e, res) => {
      if (mounted.current) dispatch({ type: "setPercentages", payload: res });
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
    return () => {
      api.removeAllListeners("res:details");
      api.removeAllListeners("res:downloaded");
      mounted.current = false;
    };
  }, [params.route, URLstate]);

  return (
    <Container
      bg={colors.background1}
      scrollColor={colors.primary}
      padding="0px 0px 20px 0px"
    >
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
          {data && (
            <InfoContainer>
              <CardInfo>
                <Card
                  colors={colors}
                  disabled
                  img={data.img}
                  type={data.type}
                  score={data.score}
                  demography={data.demography}
                  showFav
                  favorite={fav}
                  setFavorite={(f) => {
                    dispatch({ type: "setFav", payload: f });
                    if (f) {
                      api.send("set:favorite", { route: params.route, data });
                    } else {
                      api.send("remove:favorite", {
                        route: params.route,
                        ext: (URLstate as any)?.ext || "",
                      });
                    }
                  }}
                />
              </CardInfo>
              <Info>
                <Txt
                  margin="0px 0px 4px 0px"
                  fs="35px"
                  bold
                  color={colors.fontPrimary}
                  style={{ width: "95%" }}
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

                {data.genders.length > 0 && (
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
                  {data.genders.map((e, i) => (
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
          )}
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
                    itemCount={data.chapters.length}
                    width={width}
                    height={400}
                    itemSize={40}
                    outerElementType={CustomScrollbarsVirtualList}
                  >
                    {({ index, style }) => (
                      <div style={style}>
                        <Chapter
                          percentage={() => {
                            const notFound = {
                              id: data.chapters[index].links[0].id,
                              percetage: 0,
                            };
                            const per = percentages.find(
                              (u) => u.id === data.chapters[index].links[0].id
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
                          downloaded={
                            !!downs.find(
                              (u) =>
                                u.data.rid ===
                                  data.chapters[index].links[0].id && u.done
                            )
                          }
                          downloading={
                            !!downs.find(
                              (u) =>
                                u.data.rid ===
                                  data.chapters[index].links[0].id &&
                                u.inProgress
                            )
                          }
                          colors={colors}
                          root={params.route || ""}
                          chapter={data.chapters[index]}
                          ext={(URLstate as any)?.ext || ""}
                          handler={(id) => {
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
      )}
    </Container>
  );
};
