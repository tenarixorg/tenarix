import React from "react";
import { Div } from "./Elements";

interface Props {
  stages: number;
  current: number;
  doneColor?: string;
  currentColor?: string;
  pendingColor?: string;
}

export const ProgressCheck: React.FC<Props> = ({
  stages,
  current,
  doneColor,
  currentColor,
  pendingColor,
}) => {
  return (
    <Div margin="100px 0px">
      {Array.from({ length: stages }, (_, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        return (
          <Div key={i} margin="0px 20px">
            <Div
              width="30px"
              height="30px"
              borderRadius="50%"
              bg={isCurrent ? currentColor : isDone ? doneColor : pendingColor}
              zIndex={2}
            />
            {i < stages - 1 && (
              <Div
                width="50px"
                height="10px"
                bg={isDone ? currentColor : pendingColor}
                zIndex={1}
                style={{
                  position: "absolute",
                  transform: "translateY(10px) translateX(50%)",
                }}
              />
            )}
          </Div>
        );
      })}
    </Div>
  );
};
