import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsSortNumericDown, BsSortNumericUpAlt } from "react-icons/bs";
import { Chapter, Status, GenderBadge, Card } from "components";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { Details as DetailsT } from "types";
import { SpinnerDotted } from "spinners-react";
import { useTheme } from "utils";

const { api } = window.bridge;

const Container = styled.div<{ bg: string; scrollColor: string }>`
  display: block;
  background-color: ${(p) => p.bg};
  overflow-y: scroll;
  height: 100vh;
  padding-bottom: 20px;
  ::-webkit-scrollbar {
    width: 6px;
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

const Txt = styled.p<{
  pointer?: boolean;
  fs: string;
  bold?: boolean;
  color: string;
}>`
  cursor: ${(p) => (p.pointer ? "pointer" : "default")};
  margin-bottom: 4px;
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
  color: ${(p) => p.color};
`;

const Main = styled.div<{ width: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${(p) => p.width};
  align-items: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
`;

const GenderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25%;
`;

const ChaptersHeader = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 8px 10px;
  margin: 5px 0px 0px 0px;
  border-bottom: 1px solid #b4b4b434;
  position: -webkit-sticky;
  position: sticky;
  top: -1px;
  background-color: ${(p) => p.bg};
  width: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  padding: 0px 20px;
`;

const ChaptersContainer = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;
  padding: 10px 10px 20px 10px;
  background-color: ${(p) => p.bg};
`;

const Loading = styled.div<{ bg: string }>`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.bg};
`;

export const Details: React.FC = () => {
  const navigation = useNavigate();
  const params = useParams();
  const { colors } = useTheme();
  const [data, setData] = useState<DetailsT>();
  const [order, setOrder] = useState(true);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.on("res:details", (_e, res) => {
      setData(res);
      setLoading(false);
    });
    api.send("get:details", { route: params.route });
    return () => {
      api.removeAllListeners("res:details");
    };
  }, [params.route]);

  return (
    <>
      {loading ? (
        <Loading bg={colors.background1}>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color={colors.secondary}
          />
        </Loading>
      ) : (
        <Container bg={colors.background1} scrollColor={colors.primary}>
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
                />
              </CardInfo>
              <Info>
                <Txt
                  fs="35px"
                  bold
                  color={colors.fontPrimary}
                  style={{ width: "95%" }}
                >
                  {data.title}
                </Txt>
                <Txt fs="26px" bold color={colors.fontSecondary}>
                  {data.subtitle}
                </Txt>
                <Txt
                  fs="16px"
                  color={colors.fontSecondary}
                  style={{
                    margin: "20px 0px 10px 0px",
                    textIndent: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {data.description}
                </Txt>

                <Txt
                  fs="24px"
                  bold
                  color={colors.fontSecondary}
                  style={{ margin: "20px 0px 10px 0px" }}
                >
                  Géneros
                </Txt>
                <GenderContainer>
                  {data.genders.map((e, i) => (
                    <GenderBadge colors={colors} text={e} key={i + e} />
                  ))}
                </GenderContainer>
                <Txt
                  fs="24px"
                  bold
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
                      navigation(`/read/${params.route}/${id}`);
                    }}
                  />
                </div>
              ))}
            </ChaptersContainer>
          )}
        </Container>
      )}
    </>
  );
};
