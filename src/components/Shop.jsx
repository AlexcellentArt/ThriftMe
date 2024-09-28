import Products from "./Products";
import SearchBar from "./SearchBar";
import { useState } from "react";
function Shop(forcedParams,header) {
    const [search, setSearch] = useState(forcedParams);
    function setLocalSearch(params){
        //override local search params with forced ones
        Object.keys(forcedParams).forEach((param)=>params[param] = forcedParams[param])
        setSearch(params)
    }
    return (
        <div className="shop">
            <SearchBar setLocalSearch={setLocalSearch}/>
            <Products search={search}/>
        </div>
      );
}

export default Shop;