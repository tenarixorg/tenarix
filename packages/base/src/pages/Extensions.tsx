import React, { useEffect, useState } from "react";
import { Check, Container, Loading, Opts, Txt } from "components/src/Elements";
import { SearchBox, ExtensionCard } from "components";
import { SpinnerDotted } from "spinners-react";
import { format_ext } from "utils";
import { useTheme } from "context-providers";
import { Source } from "types";

const { api } = window.bridge;

export const Extensions: React.FC = () => {
  const { colors } = useTheme();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [pinnedOnly, setPinnedOnly] = useState(false);

  useEffect(() => {
    api.on("res:exts", (_e, res) => {
      setSources(res);
      setLoading(false);
    });

    api.send("get:exts");

    return () => {
      api.removeAllListeners("res:exts");
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
            <SearchBox value={query} onChange={setQuery} colors={colors} />
          </div>
          <Opts>
            <Txt color={colors.fontPrimary} fs="12px">
              Pinned Only
            </Txt>
            <Check
              value={pinnedOnly as any}
              onChange={(e) => {
                setPinnedOnly(e.target.checked);
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
