import React, { useEffect, useReducer, useRef, useCallback } from "react";
import Sanitize from "rehype-sanitize";
import GFM from "remark-gfm";
import { initialState, Markdown, reducer } from "./helper";
import { Check, Container, Div, Txt } from "components/src/Elements";
import { BsArrowDownCircle } from "react-icons/bs";
import { SearchBox } from "components";
import { useTheme } from "context-providers";

const { api } = window.bridge;

export const Plugins: React.FC = () => {
  const { colors } = useTheme();
  const [
    { installed, plugins, query, selectedPlugin, clear, showModal },
    dispatch,
  ] = useReducer(reducer, initialState);

  const modalRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const handleShowModal = useCallback((e: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as Node) &&
      btnRef.current &&
      !btnRef.current.contains(e.target as Node)
    ) {
      dispatch({ type: "setShowModal", payload: false });
    }
  }, []);

  useEffect(() => {
    api.send("get:plugins");
    api.send("get:installed:plugins");
    api.on("res:plugins", (_, res) => {
      dispatch({ type: "setPlugins", payload: res });
    });
    api.on("res:installed:plugins", (_, res) => {
      dispatch({ type: "setInstalled", payload: res });
    });

    return () => {
      api.removeAllListeners("res:plugins");
      api.removeAllListeners("res:installed:plugins");
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleShowModal);
    return () => {
      document.removeEventListener("click", handleShowModal);
    };
  }, [handleShowModal]);

  return (
    <Container bg={colors.background1} scrollColor={colors.primary} noScroll>
      {showModal && (
        <Div
          zIndex={100}
          align="center"
          justify="center"
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Div
            width="500px"
            height="200px"
            bg={colors.background1 + "b0"}
            borderRadius="4px"
            ref={modalRef}
            style={{
              backdropFilter: "blur(2px)",
              boxShadow: "4px 4px 9px -5px #000000",
              border: "1px solid black",
            }}
            justify="flex-start"
            align="center"
            direction="column"
            padding="20px 0px"
          >
            <Div justify="center" align="center" width="100%">
              <Txt fs="20px" color={colors.fontPrimary} bold>
                Are you sure you want to uninstall this plugin?
              </Txt>
            </Div>
            <Div justify="center" align="center" width="100%" margin="20px 0px">
              <Txt fs="16px" color={colors.fontPrimary}>
                Clear all related data
              </Txt>
              <Check
                value={clear as any}
                onChange={(e) => {
                  dispatch({ type: "setClear", payload: e.target.checked });
                }}
                type="checkbox"
                bg={colors.navbar.background}
                activeColor={colors.primary}
                inactiveColor={colors.secondary}
              />
            </Div>
            <Div
              justify="space-around"
              align="center"
              width="100%"
              margin="20px 0px"
            >
              <Div
                width="60px"
                bg={colors.primary}
                justify="center"
                align="center"
                borderRadius="4px"
                pointer
                onClick={() => {
                  if (!selectedPlugin) return;
                  const tarball =
                    selectedPlugin.versions[selectedPlugin.latest].tarball;
                  api.send("install:plugin", {
                    tarball,
                    uninstall: true,
                    clear,
                  });
                  dispatch({ type: "setShowModal", payload: false });
                }}
              >
                <Txt fs="16px" color={colors.fontPrimary} pointer>
                  Yes
                </Txt>
              </Div>
              <Div
                width="60px"
                bg={colors.secondary}
                justify="center"
                align="center"
                borderRadius="4px"
                pointer
                onClick={() => {
                  dispatch({ type: "setShowModal", payload: false });
                }}
              >
                <Txt fs="16px" color={colors.fontPrimary} pointer>
                  No
                </Txt>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
      <Div
        width="100%"
        height="100%"
        margin="10px 0px 0px 0px"
        style={{
          overflow: "hidden",
        }}
        padding="0px 5px 10px 5px"
      >
        <Div
          width="35%"
          height="100%"
          direction="column"
          align="center"
          justify="flex-start"
          scroll
          scrollColor={colors.primary}
          padding="0px 6px 0px 2px"
        >
          <Div width="100%">
            <SearchBox
              m="0px 0px 20px 0px"
              value={query}
              onChange={(q) => dispatch({ type: "setQuery", payload: q })}
              colors={colors}
              placeholder={"Search..."}
            />
          </Div>
          {plugins
            .filter((p) => p.name.includes(query))
            .map((plugin) => (
              <Div
                key={plugin.name}
                width="100%"
                height="50px"
                margin="0px 0px 6px 0px"
                padding="0px 5px"
                borderRadius="2px"
                bg={colors.background2}
                align="flex-start"
                justify="center"
                direction="column"
                onClick={() =>
                  dispatch({ type: "setSelectedPlugin", payload: plugin })
                }
                pointer
              >
                <Div justify="space-between" width="100%" pointer>
                  <Txt fs="16px" bold color={colors.fontPrimary} pointer>
                    {plugin.name}
                  </Txt>
                  <Txt fs="12px" bold color={colors.fontPrimary} pointer>
                    {plugin.lang.toUpperCase()}
                  </Txt>
                </Div>
                <Div width="100%">
                  <Txt
                    fs="14px"
                    color={colors.fontPrimary}
                    pointer
                    style={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      width: "80%",
                    }}
                  >
                    {plugin.versions[plugin.latest].description}
                  </Txt>
                  <Div
                    width="20%"
                    height="100%"
                    justify="flex-end"
                    align="center"
                    pointer
                  >
                    <BsArrowDownCircle
                      size={18}
                      color={
                        installed.includes(plugin.name)
                          ? colors.primary
                          : colors.secondary
                      }
                    />
                  </Div>
                </Div>
              </Div>
            ))}
        </Div>
        <Div
          width="65%"
          height="100%"
          direction="column"
          align="center"
          justify="flex-start"
          scroll
          scrollColor={colors.secondary}
          padding="0px 0px 0px 8px"
        >
          {selectedPlugin && (
            <Div height="100%" width="100%" direction="column">
              <Div
                width="100%"
                height="100px"
                margin="0px 0px 5px 0px"
                padding="0px 5px"
                align="center"
                justify="space-between"
                borderRadius="2px"
                style={{
                  borderBottom: `1px solid ${colors.primary + "a0"}`,
                }}
              >
                <Div
                  direction="column"
                  width="80%"
                  height="100%"
                  padding="10px 0px"
                >
                  <Div
                    justify="space-between"
                    width="100%"
                    padding="0px 20px 0px 0px"
                    margin="0px 0px 10px 0px"
                  >
                    <Txt fs="20px" bold color={colors.fontPrimary}>
                      {selectedPlugin.name}
                    </Txt>
                    <Div direction="column">
                      <Txt fs="12px" bold color={colors.fontPrimary}>
                        {`Language: ${selectedPlugin.lang.toUpperCase()}`}
                      </Txt>
                      <Txt fs="12px" bold color={colors.fontPrimary}>
                        {`Version: ${selectedPlugin.latest}`}
                      </Txt>
                    </Div>
                  </Div>
                  <Txt fs="14px" color={colors.fontPrimary}>
                    {selectedPlugin.versions[selectedPlugin.latest].description}
                  </Txt>
                </Div>
                <Div
                  padding="10px 0px"
                  width="20%"
                  height="100%"
                  align="center"
                  justify="flex-start"
                  direction="column"
                >
                  <Div
                    bg={
                      installed.find((u) => u == selectedPlugin.name)
                        ? colors.secondary
                        : colors.primary
                    }
                    padding="4px 10px"
                    borderRadius="4px"
                    pointer
                    ref={btnRef}
                    onClick={() => {
                      const tarball =
                        selectedPlugin.versions[selectedPlugin.latest].tarball;
                      const uninstall = installed.find(
                        (u) => u == selectedPlugin?.name
                      );
                      if (uninstall) {
                        dispatch({ type: "setShowModal", payload: true });
                      } else {
                        api.send("install:plugin", {
                          tarball,
                          uninstall,
                          clear,
                        });
                      }
                    }}
                  >
                    <Txt fs="14px" bold color={colors.fontPrimary} pointer>
                      {installed.find((u) => u == selectedPlugin.name)
                        ? "Uninstall"
                        : "Install"}
                    </Txt>
                  </Div>
                </Div>
              </Div>
              <Markdown
                color={colors.fontPrimary}
                rehypePlugins={[Sanitize, GFM]}
                linkTarget={"_blank"}
              >
                {selectedPlugin.versions[selectedPlugin.latest].readme ||
                  "No readme found"}
              </Markdown>
            </Div>
          )}
        </Div>
      </Div>
    </Container>
  );
};
