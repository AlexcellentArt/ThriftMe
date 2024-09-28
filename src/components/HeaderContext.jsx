import React, { useState, createContext } from "react";
const HeaderContext = createContext("HeaderContext");
export function HeaderContextProvider({ children }) {
  const [additonalContent, setAdditonalContent] = useState(undefined);
  const API_URL = "http://localhost:3000/api/";
  return (
    <HeaderContext.Provider
      value={{
        additonalContent,
        setAdditonalContent
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}
export default HeaderContextProvider;
export { HeaderContext };
