/* eslint-disable react/display-name */
import React, { useState, forwardRef } from "react";
import { ReadImg } from "./Elements";

interface Props {
  src: string;
  alt: string;
  imgWidth: string;
  Loading: React.FC;
  containerStyle?: React.CSSProperties;
  loadingContainerStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  className?: string;
  data?: any;
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
    },
    ref
  ) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div style={containerStyle}>
        <ReadImg
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
