import React from "react";
import { toast, Toast, ToastBar } from "react-hot-toast";
import { Theme } from "utils";
import { BsXLg } from "react-icons/bs";
import { Btn } from "../Elements";

interface Props {
  colors: Theme["dark"];
  toast: Toast;
}

export const ErrorToast: React.FC<Props> = ({ colors, toast: t }) => {
  return (
    <ToastBar
      toast={t}
      style={{
        ...t.style,
        backgroundColor: colors.navbar.background,
        color: colors.fontPrimary,
      }}
    >
      {({ icon, message }) => (
        <>
          {icon}
          {message}
          {t.type !== "loading" && (
            <Btn onClick={() => toast.dismiss(t.id)}>
              <BsXLg color="red" size={15} />
            </Btn>
          )}
        </>
      )}
    </ToastBar>
  );
};
