import React, { useCallback, useEffect, useRef, useState } from "react";
import { Navbar, Sidebar, CustomToast, Tabbar } from "components";
import { useGeneral, useNet, useTheme } from "context-providers";
import { toastMessageFormat } from "utils";
import { Router } from "./Router";
import { toast } from "react-hot-toast";

const { api } = window.bridge;

export const Pages: React.FC = () => {
  const mounted = useRef(false);
  const { net } = useNet();
  const { colors } = useTheme();
  const { showNavs } = useGeneral();
  const [closed, setClosed] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sidebarExcludeRef = useRef<HTMLButtonElement | null>(null);

  const handleSidebar = useCallback((e: MouseEvent) => {
    if (
      !sidebarRef.current?.contains(e.target as Node) &&
      !sidebarExcludeRef.current?.contains(e.target as Node)
    ) {
      if (mounted.current) setClosed(true);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    api.on("downloading:chapter", (_e, { rid, inf }) => {
      toast(toastMessageFormat(inf), {
        id: "download:" + rid,
        duration: Infinity,
      });
    });
    api.on("downloading:chapter:done", (_e, { rid }) => {
      toast.dismiss("download:" + rid);
    });
    api.on("res:error", (_e, res) => {
      toast(toastMessageFormat(res.error), {
        id: "error_toast",
        duration: 4000,
      });
    });
    api.on("close:sidebar", (_e, res) => {
      if (mounted.current) setClosed(res);
    });
    document.addEventListener("mousedown", handleSidebar);
    return () => {
      document.removeEventListener("mousedown", handleSidebar);
      api.removeAllListeners("close:sidebar");
      api.removeAllListeners("res:error");
      api.removeAllListeners("downloading:chapter");
      mounted.current = false;
    };
  }, [handleSidebar]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: colors.background2,
      }}
    >
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
        show={showNavs}
      />
      <main
        style={{
          width: "100%",
        }}
      >
        <Sidebar
          ref={sidebarRef}
          closed={closed}
          colors={colors}
          back={() => {
            window.history.back();
            setClosed((c) => !c);
          }}
          ext={() => {
            window.location.href = "#/ext";
            setClosed((c) => !c);
          }}
          plugins={() => {
            window.location.href = "#/plugins";
            setClosed((c) => !c);
          }}
          favorites={() => {
            window.location.href = "#/favorites";
            setClosed((c) => !c);
          }}
          settings={() => {
            api.send("set:last:route", {
              route: window.location.href.split("#")[1] || "/",
            });
            window.location.href = "#/settings/appearance";
            setClosed((c) => !c);
          }}
        />
        <Router />
      </main>
      <Tabbar colors={colors} net={net} show={showNavs} />
      <CustomToast colors={colors} />
    </div>
  );
};
