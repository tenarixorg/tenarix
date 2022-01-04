import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Home as HomeT } from "types";
import { SpinnerDotted } from "spinners-react";
import { useNavigate } from "react-router-dom";
import { Card } from "components";
import { useTheme } from "utils";

const { api } = window.bridge;

export const Container = styled.div<{ bg: string; scrollColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(p) => p.bg};
  overflow-y: scroll;
  height: 100vh;
  padding: 0px 0px 40px 0px;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 8px;
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

const Txt = styled.p`
  background-color: #2076ee;
  width: fit-content;
  padding: 4px 10px 12px 10px;
  font-weight: bold;
  color: black;
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
`;

const Head = styled.div`
  padding: 0px 5%;
  width: 100%;
  margin: 6px 0px 0px 0px;
  border-bottom: 1px solid #b4b4b434;
  @media (max-width: 850px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const Home: React.FC = () => {
  const navigation = useNavigate();

  const { colors } = useTheme();

  const [data, setData] = useState<HomeT>({
    popular: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.on("res:home", (_e, res) => {
      setLoading(false);
      setData(res);
    });
    api.send("get:home");
    return () => {
      api.removeAllListeners("res:home");
    };
  }, []);

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
          <Head>
            <Txt>Popular</Txt>
          </Head>

          <Grid>
            {data.popular &&
              data.popular.length !== 0 &&
              data.popular.map((e, i) => (
                <Card
                  colors={colors}
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
        </>
      )}
    </Container>
  );
};
