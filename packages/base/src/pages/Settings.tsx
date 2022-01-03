import React, { useEffect, useState } from "react";
const { api } = window.bridge;

const capitalize = (data: string) => data[0].toUpperCase() + data.slice(1);
const format = (source: string) =>
  source.split("_").reduce((acc, curr) => acc + " " + capitalize(curr), "");

export const Settings: React.FC = () => {
  const [opts, setOpts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.on("res:settings", (_e, res) => {
      setOpts(res.data);
      setSource(res.current);
      setLoading(false);
    });

    api.on("res:change:source", (_e, res) => {
      setDone(res);
      window.location.href = "#/";
    });

    api.send("get:settings");

    return () => {
      api.removeAllListeners("res:settings");
      api.removeAllListeners("res:change:source");
    };
  }, []);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>{!done ? "waiting..." : "done"}</p>
          <p>{format(source)}</p>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {opts.map((op, i) => (
              <option value={op} key={i}>
                {format(op)}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              api.send("change:source", { source });
            }}
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
};
