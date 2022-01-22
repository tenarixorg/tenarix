import React from "react";
import { Toast, Toaster } from "react-hot-toast";
import { ErrorToast } from "./ErrorToast";
import { Theme } from "utils";
import { DownloadToast } from "./DownloadToast";

interface Props {
  colors: Theme["dark"];
}

const selectToast = (id: string, toast: Toast, colors: Theme["dark"]) => {
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
    <div>
      <Toaster position="bottom-right">
        {(t) => selectToast(t.id, t, colors)}
      </Toaster>
    </div>
  );
};
