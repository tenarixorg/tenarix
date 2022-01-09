import React, { useEffect, useState } from "react";
import { BsSortNumericDown, BsSortNumericUpAlt } from "react-icons/bs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Chapter, Status, GenderBadge, Card } from "components";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { Details as DetailsT } from "types";
import { SpinnerDotted } from "spinners-react";
import { useTheme } from "context-providers";
import {
  Btn,
  CardInfo,
  ChaptersContainer,
  ChaptersHeader,
  Container,
  GenderContainer,
  Info,
  InfoContainer,
  Loading,
  Main,
  Txt,
} from "components/src/Elements";

const { api } = window.bridge;

export const Details: React.FC = () => {
  const navigation = useNavigate();
  const params = useParams();
  const { colors } = useTheme();
  const [data, setData] = useState<DetailsT>();
  const [order, setOrder] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorite2, setFavorite2] = useState(false);

  const { state: URLstate } = useLocation();

  useEffect(() => {
    api.on("res:details", (_e, { res, fav }) => {
      setData(res);
      setFavorite2(fav);
      setLoading(false);
    });
    api.send("get:details", {
      route: params.route,
      ext: (URLstate as any)?.ext || "",
    });
    return () => {
      api.removeAllListeners("res:details");
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
                  favorite={favorite2}
                  setFavorite={(f) => {
                    setFavorite2(f);
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
                  fs="26px"
                  margin="0px 0px 4px 0px"
                  bold
                  color={colors.fontSecondary}
                >
                  {data.subtitle}
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
                    Géneros
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
                  Estado
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
              onClick={() => setShow((c) => !c)}
            >
              Capítulos
            </Txt>
            <Main width="70px">
              <Btn
                onClick={() => {
                  setOrder((c) => !c);
                  setData((c) => {
                    if (c) return { ...c, chapters: [...c.chapters].reverse() };
                  });
                }}
              >
                {!order ? (
                  <BsSortNumericDown color={colors.secondary} size={25} />
                ) : (
                  <BsSortNumericUpAlt color={colors.secondary} size={25} />
                )}
              </Btn>
              <Btn onClick={() => setShow((c) => !c)}>
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
