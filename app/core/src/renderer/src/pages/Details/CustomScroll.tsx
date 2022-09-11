import React, { useCallback } from "react";
import { CustomScroll } from "components/src/Elements";
import { useTheme } from "context-providers";

const CustomScrollbars: React.FC<{
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  forwardedRef?: any;
  style?: React.CSSProperties;
  children?: any;
}> = ({ onScroll, forwardedRef, style, children }) => {
  const { colors } = useTheme();

  const refSetter = useCallback(
    (scrollbarsRef: any) => {
      if (scrollbarsRef) {
        forwardedRef(scrollbarsRef.view);
      } else {
        forwardedRef(null);
      }
    },
    [forwardedRef]
  );

  return (
    <CustomScroll
      ref={refSetter}
      scrollColor={colors.secondary}
      style={{
        ...style,
      }}
      onScroll={onScroll}
    >
      {children}
    </CustomScroll>
  );
};

export const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref} />
));
