import React, { useEffect, useReducer, useRef } from "react";
import { BsSortNumericDown, BsSortNumericUpAlt } from "react-icons/bs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Chapter, Status, GenderBadge, Card } from "components";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useLang, useTheme } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import {
  Btn,
  Txt,
  Main,
  Info,
  Loading,
  CardInfo,
  Container,
  InfoContainer,
  ChaptersHeader,
  GenderContainer,
  ChaptersContainer,
} from "components/src/Elements";
import { initialState, reducer } from "./helper";

const { api } = window.bridge;

export const Details: React.FC = () => {
  const mounted = useRef(false);
  const navigation = useNavigate();
  const params = useParams();
  const { colors } = useTheme();
  const { lang } = useLang();

  const { state: URLstate } = useLocation();

  const [{ show, order, data, loading, fav, downs }, dispatch] = useReducer(
    reducer,
    initialState
  );

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

    api.send("get:details", {
      route: params.route,
      ext: (URLstate as any)?.ext || "",
    });

    api.send("get:downloaded", {
      ext: (URLstate as any)?.ext || "",
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
                <Txt
                  fs="16px"
                  margin="0px 0px 4px 0px"
                  color={colors.fontSecondary}
                  style={{
                    margin: "20px 0px 10px 0px",
                    textIndent: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {data.description}
                </Txt>

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
            <ChaptersContainer bg={colors.background2}>
              {data?.chapters.map((e, i) => (
                <div key={i}>
                  <Chapter
                    downloaded={!!downs.find((u) => u === e.links[0].id)}
                    colors={colors}
                    root={params.route || ""}
                    chapter={e}
                    handler={(id) => {
                      navigation(`/read/${params.route}/${id}`, {
                        state: { ext: (URLstate as any)?.ext || "" },
                      });
                    }}
                  />
                </div>
              ))}
            </ChaptersContainer>
          )}
        </>
      )}
    </Container>
  );
};
