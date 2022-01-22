import React, { useState } from "react";
import { Toast, ToastBar } from "react-hot-toast";
import { SpinnerCircular } from "spinners-react";
import { Theme } from "utils";
import { BsChevronDown } from "react-icons/bs";
import styled from "styled-components";

const Message = styled.div<{ animate?: boolean }>`
  display: flex;
  flex-direction: row;
  transition: width 400ms ease-in-out;
  width: ${(p) => (p.animate ? "0px" : "fit-content")};
  font-size: ${(p) => (p.animate ? "0px" : "15px")};
`;

const Btn = styled.button<{ animate?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  transition: transform 400ms ease-in-out;
  transform: rotate(${(p) => (p.animate ? "-180" : "0")}deg);
`;

interface Props {
  colors: Theme["dark"];
  toast: Toast;
}

export const DownloadToast: React.FC<Props> = ({ colors, toast: t }) => {
  const [animate, setAnimate] = useState(false);
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
          <Message animate={animate}>
            {
              <SpinnerCircular
                size={22}
                color={colors.secondary}
                thickness={140}
              />
            }
            {message}
          </Message>
          {t.type !== "loading" && (
            <Btn onClick={() => setAnimate((c) => !c)} animate={animate}>
              <BsChevronDown color={colors.primary} size={20} />
            </Btn>
          )}
        </>
      )}
    </ToastBar>
  );
};
