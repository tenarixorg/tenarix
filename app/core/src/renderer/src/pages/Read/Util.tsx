import React from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const Wrapper: React.FC = ({ children }) => {
  return (
    <TransformWrapper
      pinch={{
        disabled: true,
      }}
      panning={{
        disabled: false,
        excluded: ["button", "input", "select", "textarea"],
        velocityDisabled: true,
      }}
      wheel={{
        disabled: false,
        wheelDisabled: true,
      }}
      minScale={0.5}
      centerOnInit={true}
      centerZoomedOut={true}
      doubleClick={{
        disabled: false,
        mode: "reset",
      }}
      limitToBounds={true}
    >
      <TransformComponent>{children}</TransformComponent>;
    </TransformWrapper>
  );
};
