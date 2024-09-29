import React, { useState, createContext,useEffect } from "react";
const HeaderContext = createContext("HeaderContext");
export function HeaderContextProvider({ children }) {
  const [additonalContent, setAdditonalContent] = useState(undefined);
  const API_URL = "http://localhost:3000/api/";
    // let location = useLocation();
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
