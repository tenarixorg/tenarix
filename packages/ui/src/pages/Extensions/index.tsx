import React, { useEffect, useReducer, useRef } from "react";
import { format_ext, langs2SelectOptions, sourcesFilter } from "utils";
import { Check, Container, Loading, Opts, Txt } from "components/src/Elements";
import { SearchBox, ExtensionCard, LangSelect } from "components";
import { initialState, reducer } from "./helper";
import { useLang, useTheme } from "context-providers";
import { SpinnerDotted } from "spinners-react";

const { api } = window.bridge;

export const Extensions: React.FC = () => {
  const mounted = useRef(false);
  const { colors } = useTheme();
  const { lang } = useLang();
  const [{ sources, pinnedOnly, loading, query, langs, slangs }, dispatch] =
    useReducer(reducer, initialState);
  useEffect(() => {
    api.on("res:exts", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setSources", payload: res });
        dispatch({ type: "setLoading", payload: false });
      }
    });
    api.on("res:all:lang", (_e, res) => {
      if (mounted.current) {
        dispatch({ type: "setLangs", payload: res });
      }
    });
    mounted.current = true;
    api.send("get:exts");
    api.send("get:all:lang");
    return () => {
      mounted.current = false;
      api.removeAllListeners("res:exts");
      api.removeAllListeners("res:all:lang");
    };
  }, []);
  return (
    <Container
      bg={colors.background1}
      scrollColor={colors.primary}
      padding="0px 34px 40px 34px"
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
              m="30px 0px 0px 0px"
              value={query}
              onChange={(q) =>
                dispatch({ type: "setQuery", payload: q.target.value })
              }
              colors={colors}
              placeholder={lang.extensions.search_placeholder}
            />
          </div>
          <Opts>
            <LangSelect
              title={lang.extensions.select_title}
              placeholder={lang.extensions.search_placeholder}
              onChange={(values) => {
                dispatch({ type: "setSlangs", payload: values });
              }}
              colors={colors}
              options={langs2SelectOptions(langs)}
              values={slangs}
            />
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
              .filter(sourcesFilter(pinnedOnly, query, slangs))
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
                  lang={e.lang.toUpperCase()}
                  colors={colors}
                />
              ))}
          </div>
        </>
      )}
    </Container>
  );
};
