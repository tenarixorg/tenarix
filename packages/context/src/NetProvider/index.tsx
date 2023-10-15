import React, { createContext, useState, useEffect, useContext } from "react";

const netContext = createContext<boolean>(true);

const { api } = window.bridge;

export const NetProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [net, setNet] = useState<boolean>(true);

  useEffect(() => {
    api.on("internet:connection", (_e, res) => {
      setNet(res);
    });
    return () => {
      api.removeAllListeners("internet:connection");
    };
  }, []);

  return <netContext.Provider value={net}>{children}</netContext.Provider>;
};

export const useNet = () => {
  const net = useContext(netContext);
  return { net };
};
