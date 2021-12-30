import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { Library as LibraryT } from "types";
import { SpinnerDotted } from "spinners-react";
import { Card } from "components";
const { api } = window.bridge;

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a1a;
  overflow-y: scroll;
  z-index: 1;
  height: 100vh;
  padding: 0px 0px 100px 0px;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: #b4b4b434;
  }

  ::-webkit-scrollbar-thumb {
    background: #4f9ce8;
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2076ee;
  }
`;

const Txt = styled.p<{
  fs: string;
  bold?: boolean;
  color: string;
}>`
  margin-bottom: 4px;
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
  color: ${(p) => p.color};
`;

const Btn = styled.button<{ right?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  transition: transform 400ms ease-in-out;
  &:hover {
    transform: translateX(${(p) => (p.right ? "5px" : "-5px")});
  }
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  justify-items: center;
  margin: 10px 0px 0px 5px;
  @media (max-width: 850px) {
    grid-template-columns: repeat(3, 1fr);
  }
  z-index: 2;
  background-color: #1a1a1a;
`;

const Head = styled.div`
  padding: 0px 5%;
  width: 100%;
  margin: 6px 0px 0px 0px;
  border-bottom: 1px solid #b4b4b434;
`;

const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Pagination = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

export const Library: React.FC = () => {
  const params = useParams();

  const navigation = useNavigate();

  const [data, setData] = useState<LibraryT["items"]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  useEffect(() => {
    api.on("res:library", (_e, res) => {
      setData(res);
      setLoading(false);
    });
    setLoading(true);
    api.send("get:library", {
      page,
      filters: {
        title: params.query,
        filterBy: "title",
      },
    });
    return () => {
      api.removeAllListeners("res:library");
    };
  }, [params.query]);

  useEffect(() => {
    if (page < 1) setPage(1);
    if (page > 1) {
      setLoading(true);
      api.send("get:library", {
        page,
        filters: {
          title: params.query,
          filterBy: "title",
        },
      });
    }
  }, [page]);

  return (
    <Container>
      {!loading ? (
        <>
          <Head>
            <Txt fs="16px" color="#fff">
              Resultados
            </Txt>
          </Head>
          <Grid>
            {data &&
              data.length !== 0 &&
              data.map((e, i) => (
                <Card
                  pointer
                  key={i}
                  img={e.img}
                  onClick={() => {
                    navigation(`/details/${e.route}`);
                  }}
                  type={e.type}
                  demography={e.demography}
                  title={e.title}
                  score={e.score}
                />
              ))}
          </Grid>

          <Pagination>
            <Btn onClick={() => setPage((c) => c - 1)}>
              <BsChevronDoubleLeft size={24} color="#fff" />
            </Btn>
            <Txt fs="20px" color="#fff" style={{ margin: "0px 10px" }}>
              {page}
            </Txt>
            <Btn right onClick={() => setPage((c) => c + 1)}>
              <BsChevronDoubleRight size={24} color="#fff" />
            </Btn>
          </Pagination>
        </>
      ) : (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color="#e81c6f"
          />
        </Loading>
      )}
    </Container>
  );
};
