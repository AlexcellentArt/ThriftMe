import React,{ useState, useEffect, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { SearchContext } from "./SearchContext";
function ShopNow({
  headerMsg = "Shop Now",
  headerSize = 2,
  bgClasses,
  img,
  alt,
  path = "products",
  state={},
  params = undefined,
}) {
  const { setSearchParams } = useContext(SearchContext);
  const nav = useNavigate();
  function makeHeader() {
    switch (headerSize) {
      case 1:
        return <h1>{headerMsg}</h1>;
      case 2:
        return <h2>{headerMsg}</h2>;
      case 3:
        return <h3>{headerMsg}</h3>;
      case 4:
        return <h4>{headerMsg}</h4>;
      case 5:
        return <h5>{headerMsg}</h5>;
      default:
        break;
    }
  }
  function navToProducts(tag){
    setSearchParams({tags:tag})
    nav({
      pathname: "/products/",
      search: createSearchParams({
        text_search:tag,
        tags:[tag]
      }).toString(),
    });
  }
  function navigateToPath() {
    setSearchParams(params)
    const options = {}
    if (params != undefined){
      navToProducts(params.tags)
      // options["search"]=createSearchParams(params).toString()
      // console.log(params)
      // console.log("searhc "+options["search"])
    }
    else{
      if (state){options["state"] = state}
      console.log(state)
      nav("/"+path,options);
    }
  }
  return (
    <div className={`flex-h shop-now ${bgClasses}`}>
      <div className="flex-v">
        {makeHeader()}
        <button
          className="merriweather-bold white-button large-text"
          onClick={() => {
            navigateToPath();
          }}
        >
          Shop Now
        </button>
      </div>
      <div className="flex-h">
        <img className="square" src={img} alt={alt} />
      </div>
    </div>
  );
}
export default ShopNow;
export {ShopNow}
