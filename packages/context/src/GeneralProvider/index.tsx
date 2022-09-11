import React, { createContext, useState, useEffect, useContext } from "react";

interface IGeneralProvider {
  showNavs: boolean;
  canNavigate: boolean;
}

const initialState: IGeneralProvider = {
  showNavs: false,
  canNavigate: false,
};

const generalContext = createContext<IGeneralProvider>(initialState);

const { api } = window.bridge;

export const GeneralProvider: React.FC<any> = ({ children }) => {
  const [general, setGeneral] = useState<IGeneralProvider>(initialState);

  useEffect(() => {
    api.on("res:navigate", (_e, res) => {
      setGeneral((c) => ({ ...c, showNavs: res, canNavigate: res }));
    });
  }, []);

  return (
    <generalContext.Provider value={general}>
      {children}
    </generalContext.Provider>
  );
};

export const useGeneral = () => {
  const general = useContext(generalContext);
  return { ...general };
};
