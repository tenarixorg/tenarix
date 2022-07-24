import React from "react";
import { IoCloudOfflineOutline, IoReloadOutline } from "react-icons/io5";
import { Btn, Div, Txt } from "./Elements";

interface Props {
  msg: string;
  color: string;
  iconColor: string;
}

export const NoInternet: React.FC<Props> = ({ msg, color, iconColor }) => {
  return (
    <Div
      width="100%"
      height="100%"
      justify="center"
      align="center"
      direction="column"
    >
      <IoCloudOfflineOutline color={iconColor} size={200} />
      <Txt fs="16px" bold color={color}>
        {msg}
      </Txt>
      <Btn
        onClick={() => {
          window.location.reload();
        }}
        style={{
          marginTop: 10,
        }}
      >
        <IoReloadOutline size={40} color={iconColor} />
      </Btn>
    </Div>
  );
};
