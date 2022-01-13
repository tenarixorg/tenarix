import React, { useEffect, useReducer, useRef } from "react";
import { Check, Container, Loading, Opts, Txt } from "components/src/Elements";
import { SearchBox, ExtensionCard } from "components";
import { initialState, reducer } from "./helper";
import { useLang, useTheme } from "context-providers";
import { SpinnerDotted } from "spinners-react";
import { format_ext } from "utils";

const { api } = window.bridge;

export const Extensions: React.FC = () => {
  const mounted = useRef(false);
  const { colors } = useTheme();
  const { lang } = useLang();
  const [{ sources, pinnedOnly, loading, query }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    api.on("res:exts", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setSources", payload: res });
        dispatch({ type: "setLoading", payload: false });
      }
    });

    api.send("get:exts");
    mounted.current = true;

    return () => {
      api.removeAllListeners("res:exts");
      mounted.current = false;
    };
  }, []);
  return (
    <Container
      bg={colors.background1}
      scrollColor={colors.primary}
      padding="0px 34px"
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
          <div style={{ width: 350 }}>
            <SearchBox
              value={query}
              onChange={(q) => dispatch({ type: "setQuery", payload: q })}
              colors={colors}
              placeholder={lang.extensions.search_placeholder}
            />
          </div>
          <Opts>
            <Txt color={colors.fontPrimary} fs="12px">
              {lang.extensions.pin_option_text}
            </Txt>
            <Check
              value={pinnedOnly as any}
              onChange={(e) => {
                dispatch({ type: "setPinnedOnly", payload: e.target.checked });
              }}
              type="checkbox"
              bg={colors.navbar.background}
              activeColor={colors.primary}
              inactiveColor={colors.secondary}
            />
          </Opts>
          <div style={{ width: "100%" }}>
            {sources
              .filter((u) => {
                if (pinnedOnly) {
                  if (
                    format_ext(u.ext)
                      .toLowerCase()
                      .includes(query.toLowerCase()) &&
                    u.pinned
                  )
                    return u;
                } else {
                  if (
                    format_ext(u.ext)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                    return u;
                }
              })
              .map((e, i) => (
                <ExtensionCard
                  key={i}
                  go={() => {
                    api.send("change:source", { source: e.ext });
                    window.location.href = "#/home";
                  }}
                  pin={() => {
                    if (e.pinned) {
                      api.send("remove:pin:ext", { ext: e.ext });
                    } else {
                      api.send("add:pin:ext", { ext: e.ext });
                    }
                  }}
                  pinned={e.pinned}
                  name={format_ext(e.ext)}
                  lang="ES"
                  colors={colors}
                />
              ))}
          </div>
        </>
      )}
    </Container>
  );
};
