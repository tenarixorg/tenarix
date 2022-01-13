import React, { useReducer, useEffect, useRef } from "react";
import { Container, Grid, Head, Loading, Txt } from "components/src/Elements";
import { initialState, reducer } from "./helper";
import { useLang, useTheme } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import { useNavigate } from "react-router-dom";
import { Card } from "components";

const { api } = window.bridge;

export const Favorites: React.FC = () => {
  const mounted = useRef(false);
  const navigation = useNavigate();
  const { colors } = useTheme();
  const { lang } = useLang();
  const [{ favs, loading }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    mounted.current = true;
    api.on("res:favorites", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setFavs", payload: res });
        dispatch({ type: "setLoading", payload: false });
      }
    });
    api.send("get:favorites");
    return () => {
      api.removeAllListeners("res:favorites");
      mounted.current = false;
    };
  }, []);

  return (
    <Container
      bg={colors.background1}
      scrollColor={colors.primary}
      padding="0px 10px 40px 10px"
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
          <Head>
            <Txt fs="16px" bold color={colors.fontPrimary}>
              {lang.favorites.head}
            </Txt>
          </Head>

          <Grid margin="10px 0px 0px 5px">
            {favs &&
              favs.length !== 0 &&
              favs.map((e, i) => (
                <Card
                  colors={colors}
                  pointer
                  showFav
                  favorite
                  key={i}
                  img={e.data.img}
                  onClick={() => {
                    navigation(`/details/${e.route}`, {
                      state: { ext: e.ext },
                    });
                  }}
                  type={e.data.type}
                  title={e.data.title}
                  setFavorite={() => {
                    api.send("remove:favorite", { route: e.route, ext: e.ext });
                    api.send("get:favorites");
                  }}
                />
              ))}
          </Grid>
        </>
      )}
    </Container>
  );
};
