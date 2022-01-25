import React, { useState } from "react";
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
}

export const LazyImage: React.FC<Props> = ({
  imgWidth,
  src,
  alt,
  Loading,
  containerStyle,
  imageStyle,
  loadingContainerStyle,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={containerStyle}>
      <ReadImg
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
};
