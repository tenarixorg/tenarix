import React, { useCallback, useEffect, useRef, useState } from "react";
import { Navbar, Sidebar } from "components";
import { useTheme } from "context-providers";
import { Pages } from "./pages";

const { api } = window.bridge;

export const Main: React.FC = () => {
  const { colors } = useTheme();
  const [closed, setClosed] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sidebarExcludeRef = useRef<HTMLButtonElement | null>(null);

  const handleSidebar = useCallback(
    (e: MouseEvent) => {
      if (
        !sidebarRef.current?.contains(e.target as Node) &&
        !sidebarExcludeRef.current?.contains(e.target as Node)
      ) {
        setClosed(true);
      }
    },
    [sidebarRef]
  );

  useEffect(() => {
    api.on("close:sidebar", (_e, res) => {
      setClosed(res);
    });
    document.addEventListener("mousedown", handleSidebar);
    return () => {
      document.removeEventListener("mousedown", handleSidebar);
    };
  }, [handleSidebar]);

  return (
    <>
      <Navbar
        ref={sidebarExcludeRef}
        colors={colors}
        sideAni={!closed}
        sidebar={() => {
          if (!window.location.href.includes("settings")) setClosed((c) => !c);
        }}
        close={() => {
          api.send("closeApp");
        }}
        maximize={() => {
          api.send("maximizeApp");
        }}
        minimize={() => {
          api.send("minimizeApp");
        }}
      />
      <main style={{ marginTop: 22, position: "relative" }}>
        <Sidebar
          ref={sidebarRef}
          closed={closed}
          colors={colors}
          back={() => {
            window.history.back();
            setClosed((c) => !c);
          }}
          home={() => {
            window.location.href = "#/";
            setClosed((c) => !c);
          }}
          forward={() => {
            window.history.forward();
            setClosed((c) => !c);
          }}
          favorites={() => {
            window.location.href = "#/favorites";
            setClosed((c) => !c);
          }}
          settings={() => {
            window.history.pushState(
              { prev: window.location.href },
              "",
              "#/settings/appearance"
            );
            window.location.href = "#/settings/appearance";
            setClosed((c) => !c);
          }}
        />
        <Pages />
      </main>
    </>
  );
};
