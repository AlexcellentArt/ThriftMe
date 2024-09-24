import React, { useState, createContext } from "react";
const SearchContext = createContext("SearchContext");
export function SearchContextProvider({ children }) {
  const [searchParams, setSearchParams] = useState({"search_text":undefined,"tags":[]});
  const API_URL = "http://localhost:3000/api/";
  return (
    <SearchContext.Provider
      value={{
        API_URL,
        setSearchParams,
        searchParams
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
export default SearchContextProvider;
export { SearchContext };
