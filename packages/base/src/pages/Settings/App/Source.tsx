import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "utils";
const { api } = window.bridge;

const capitalize = (data: string) => data[0].toUpperCase() + data.slice(1);
const format = (source: string) =>
  source.split("_").reduce((acc, curr) => acc + " " + capitalize(curr), "");

const Select = styled.select`
  border: none;
  outline: none;
`;
const Option = styled.option`
  border: none;
  outline: none;
`;

export const Source: React.FC = () => {
  const [opts, setOpts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");

  const { colors } = useTheme();

  useEffect(() => {
    api.on("res:settings", (_e, res) => {
      setOpts(res.data);
      setSource(res.current);
      setLoading(false);
    });

    api.send("get:settings");

    return () => {
      api.removeAllListeners("res:settings");
    };
  }, []);

  useEffect(() => {
    source && api.send("change:source", { source });
  }, [source]);
  return (
    <div>
      {loading ? (
        <p style={{ color: colors.fontSecondary }}>Loading...</p>
      ) : (
        <>
          <p style={{ color: colors.fontSecondary }}>{format(source)}</p>
          <Select value={source} onChange={(e) => setSource(e.target.value)}>
            {opts.map((op, i) => (
              <Option value={op} key={i}>
                {format(op)}
              </Option>
            ))}
          </Select>
        </>
      )}
    </div>
  );
};
