import React, { useState, createContext, useEffect } from "react";

const HeaderContext = createContext("HeaderContext");

export function HeaderContextProvider({ children }) {
  const [additonalContent, setAdditonalContent] = useState(undefined);
  const API_URL = "/api/"
  return (
    <HeaderContext.Provider
      value={{
        additonalContent,
        setAdditonalContent,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export default HeaderContextProvider;
export { HeaderContext };
