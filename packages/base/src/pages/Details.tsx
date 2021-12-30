import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsSortNumericDown, BsSortNumericUpAlt } from "react-icons/bs";
import { Chapter, Status, GenderBadge, Card } from "components";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { Details as DetailsT, Read } from "types";
import { SpinnerDotted } from "spinners-react";
import { Get } from "services";

const Container = styled.div`
  display: block;
  background-color: #1a1a1a;
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
    background: #4f9ce8;
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2076ee;
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

const ChaptersHeader = styled.div`
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
  background-color: #1a1a1a;
  width: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  padding: 0px 20px;
`;

const ChaptersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;
  padding: 10px 10px 20px 10px;
  background-color: #242424;
`;

const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const Details: React.FC = () => {
  const navigation = useNavigate();
  const params = useParams();

  const [data, setData] = useState<DetailsT>();
  const [chapters, setChapters] = useState<DetailsT["chapters"]>();
  const [order, setOrder] = useState(true);

  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await Get<{ result: DetailsT }>(`/details/${params.route}`);
      setData(res.data.result);
      setChapters([...res.data.result.chapters].reverse());
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color="#e81c6f"
          />
        </Loading>
      ) : (
        <Container>
          {data && (
            <InfoContainer>
              <CardInfo>
                <Card
                  disabled
                  img={data.img}
                  type={data.type}
                  score={data.score}
                  demography={data.demography}
                />
              </CardInfo>
              <Info>
                <Txt fs="35px" bold color="#ffffff" style={{ width: "92%" }}>
                  {data.title}
                </Txt>
                <Txt fs="26px" bold color="#8d8d8d">
                  {data.subtitle}
                </Txt>
                <Txt
                  fs="16px"
                  color="#c0c0c0"
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
                  color="#c4c4c4"
                  style={{ margin: "20px 0px 10px 0px" }}
                >
                  Géneros
                </Txt>
                <GenderContainer>
                  {data.genders.map((e, i) => (
                    <GenderBadge text={e} key={i + e} />
                  ))}
                </GenderContainer>
                <Txt
                  fs="24px"
                  bold
                  color="#c4c4c4"
                  style={{ margin: "20px 0px 10px 0px" }}
                >
                  Estado
                </Txt>
                <Status state={data.status} />
              </Info>
            </InfoContainer>
          )}
          <ChaptersHeader>
            <Txt
              color="#ffffff"
              pointer
              fs="25px"
              bold
              onClick={() => setShow((c) => !c)}
            >
              Capítulos
            </Txt>
            <Main width="70px">
              <Btn onClick={() => setOrder((c) => !c)}>
                {!order ? (
                  <BsSortNumericDown color="#e83588" size={25} />
                ) : (
                  <BsSortNumericUpAlt color="#e83588" size={25} />
                )}
              </Btn>
              <Btn onClick={() => setShow((c) => !c)}>
                {show ? (
                  <RiArrowUpSLine color="#e83588" size={30} />
                ) : (
                  <RiArrowDownSLine color="#e83588" size={30} />
                )}
              </Btn>
            </Main>
          </ChaptersHeader>
          {show &&
            (order ? (
              <ChaptersContainer>
                {data?.chapters.map((e, i) => (
                  <div key={i}>
                    <Chapter
                      dowload={async (rid) => {
                        const res = await Get<{ result: Read }>(`/read/${rid}`);
                        return {
                          total: res.data.result.pages,
                          root: data.subtitle,
                          id: res.data.result.id,
                        };
                      }}
                      chapter={e}
                      handler={(id) => {
                        navigation(`/read/${id}`);
                      }}
                    />
                  </div>
                ))}
              </ChaptersContainer>
            ) : (
              <ChaptersContainer>
                {chapters?.map((e, i) => (
                  <div key={i}>
                    <Chapter
                      dowload={async () => {
                        return { root: "", total: 0, id: "" };
                      }}
                      chapter={e}
                      handler={(id) => {
                        navigation(`/read/${id}`);
                      }}
                    />
                  </div>
                ))}
              </ChaptersContainer>
            ))}
        </Container>
      )}
    </>
  );
};
