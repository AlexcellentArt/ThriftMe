import React, { useState, createContext } from "react";
const SearchContext = createContext("SearchContext");
export function SearchContextProvider({ children }) {
  const [searchParams, setSearchParams] = useState({
    search_text: undefined,
    tags: [],
    seller_id: undefined,
  });
  const API_URL = "http://localhost:3000/api/";
  function reset() {
    setSearchParams({ search_text: undefined, tags: [], seller_id: undefined });
    return { search_text: undefined, tags: [], seller_id: undefined };
  }
  return (
    <SearchContext.Provider
      value={{
        API_URL,
        setSearchParams,
        searchParams,
        reset,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
export default SearchContextProvider;
export { SearchContext };
