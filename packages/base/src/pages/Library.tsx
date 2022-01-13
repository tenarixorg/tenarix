import React, { useEffect, useState } from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { Library as LibraryT } from "types";
import { useTheme, useLang } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import { Card } from "components";
import {
  BtnAni,
  Container,
  Grid,
  Head,
  Loading,
  Pagination,
  Txt,
} from "components/src/Elements";

const { api } = window.bridge;

export const Library: React.FC = () => {
  const params = useParams();
  const navigation = useNavigate();
  const { colors } = useTheme();
  const { lang } = useLang();
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
      page: 1,
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
  }, [params.query, page]);

  return (
    <Container
      bg={colors.background1}
      scrollColor={colors.primary}
      padding="0px 10px 100px 10px"
    >
      {!loading ? (
        <>
          <Head>
            <Txt margin="0px 0px 4px 0px" fs="16px" color={colors.fontPrimary}>
              {lang.library.head}
            </Txt>
          </Head>
          <Grid bg={colors.background1} margin="10px 0px 0px 5px">
            {data &&
              data.length !== 0 &&
              data.map((e, i) => (
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

          <Pagination>
            <BtnAni onClick={() => setPage((c) => c - 1)}>
              <BsChevronDoubleLeft size={24} color={colors.buttons.color} />
            </BtnAni>
            <Txt
              margin="0px 0px 4px 0px"
              fs="20px"
              color={colors.buttons.color}
              style={{ margin: "0px 10px" }}
            >
              {page}
            </Txt>
            <BtnAni right onClick={() => setPage((c) => c + 1)}>
              <BsChevronDoubleRight size={24} color={colors.buttons.color} />
            </BtnAni>
          </Pagination>
        </>
      ) : (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color={colors.secondary}
          />
        </Loading>
      )}
    </Container>
  );
};
