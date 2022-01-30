import React from "react";
import { Toast, Toaster } from "react-hot-toast";
import { DownloadToast } from "./DownloadToast";
import { ErrorToast } from "./ErrorToast";
import { BaseTheme } from "types";

interface Props {
  colors: BaseTheme;
}

const selectToast = (id: string, toast: Toast, colors: BaseTheme) => {
  switch (id) {
    case "error_toast":
      return <ErrorToast toast={toast} colors={colors} />;

    default:
      if (id.includes("download")) {
        return <DownloadToast toast={toast} colors={colors} />;
      }
      return <></>;
  }
};

export const CustomToast: React.FC<Props> = ({ colors }) => {
  return (
    <Toaster position="bottom-right">
      {(t) => selectToast(t.id, t, colors)}
    </Toaster>
  );
};
