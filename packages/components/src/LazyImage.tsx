/* eslint-disable react/display-name */
import React, { useState, forwardRef } from "react";
import { ReadImg, Txt } from "./Elements";

interface Props {
  src: string;
  alt: string;
  imgWidth: string;
  Loading: () => JSX.Element;
  containerStyle?: React.CSSProperties;
  loadingContainerStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  className?: string;
  data?: any;
  indicatorColors?: {
    txt: string;
    bg: string;
  };
  indicator?: boolean;
}

export const LazyImage = forwardRef<HTMLImageElement, Props>(
  (
    {
      imgWidth,
      src,
      alt,
      Loading,
      containerStyle,
      imageStyle,
      loadingContainerStyle,
      onError,
      className,
      data,
      indicatorColors,
      indicator,
    },
    ref
  ) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div style={{ ...containerStyle, position: "relative" }}>
        {indicator && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 9,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: indicatorColors?.bg || "transparent",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
              margin: 0,
            }}
          >
            <Txt color={indicatorColors?.txt || "black"} fs="32px" bold>
              {data}
            </Txt>
          </div>
        )}
        <ReadImg
          id={"img__" + data}
          data-saved={data || ""}
          className={className || ""}
          ref={ref}
          src={src}
          alt={alt}
          draggable={false}
          width={imgWidth}
          style={{
            ...imageStyle,
            zIndex: 8,
          }}
          onLoad={() => {
            setLoaded(true);
          }}
          onError={onError}
        />
        {!loaded && (
          <div style={{ ...loadingContainerStyle, zIndex: 10 }}>
            <Loading />
          </div>
        )}
      </div>
    );
  }
);
