import React, { useEffect, useRef, useReducer } from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { initialState, reducer } from "./helper";
import { useTheme, useLang } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import { Card } from "components";
import {
  Txt,
  Grid,
  Head,
  BtnAni,
  Loading,
  Container,
  Pagination,
} from "components/src/Elements";

const { api } = window.bridge;

export const Library: React.FC = () => {
  const mounted = useRef(false);
  const params = useParams();
  const navigation = useNavigate();
  const { colors } = useTheme();
  const { lang } = useLang();

  const [{ page, loading, data }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    mounted.current = true;
    api.on("res:library", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setData", payload: res });
        dispatch({ type: "setLoading", payload: false });
      }
    });
    dispatch({ type: "setLoading", payload: true });
    api.send("get:library", {
      page: 1,
      filters: {
        title: params.query,
        filterBy: "title",
      },
    });
    return () => {
      api.removeAllListeners("res:library");
      mounted.current = false;
    };
  }, [params.query]);

  useEffect(() => {
    if (page < 0) dispatch({ type: "setPage", payload: 1 });
    else {
      dispatch({ type: "setLoading", payload: true });
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
                  title={e.title}
                />
              ))}
          </Grid>

          <Pagination>
            <BtnAni
              onClick={() => dispatch({ type: "decrementPage", payload: 1 })}
            >
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
            <BtnAni
              right
              onClick={() => dispatch({ type: "incrementPage", payload: 1 })}
            >
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
