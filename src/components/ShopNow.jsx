import React, { useState, useEffect, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { SearchContext } from "./SearchContext";

function ShopNow({
  headerMsg = "Shop Now",
  headerSize = 2,
  subheader = "Trending Now",
  bgClasses,
  img,
  alt,
  path = "products",
  state = {},
  params = undefined,
}) {
  const { setSearchParams } = useContext(SearchContext);
  const nav = useNavigate();
  function makeHeader(size, msg) {
    switch (size) {
      case 1:
        return <h1>{msg}</h1>;
      case 2:
        return <h2>{msg}</h2>;
      case 3:
        return <h3>{msg}</h3>;
      case 4:
        return <h4>{msg}</h4>;
      case 5:
        return <h5>{msg}</h5>;
      default:
        break;
    }
  }
  function navToProducts(tag) {
    setSearchParams({ tags: tag });
    nav("/products/",{
      search: createSearchParams({
        text_search: tag,
        tags: [tag],
      }).toString(),
    });
  }

  function navigateToPath() {
    setSearchParams(params);
    const options = {};
    if (params != undefined) {
      navToProducts(params.tags);
    } else {
      if (state) {
        options["state"] = state;
      }
      console.log(state);
      nav("/" + path, options);
    }
  }

  return (
    <div className={`flex-h shop-now ${bgClasses}`}>
      <div className="flex-v">
        {makeHeader(headerSize, headerMsg)}
        {makeHeader(headerSize + 1, subheader)}
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
export { ShopNow };
