import DisplayMany from "./DisplayMany";
import { useState, useContext } from "react";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import React from "react";
import { AuthContext } from "./AuthContext";
import { SearchContext } from "./SearchContext";
import { useEffect } from "react";
import { HeaderContext } from "./HeaderContext";

function Products({ data, search, headerText = "Products" }) {
  // data will override the ability to search and just display the given data. search will override the main search bar and it's params, letting a local search happen. headerText will override what the header says
  const nav = useNavigate();
  const { searchParams } = useContext(SearchContext);
  const [products, setProduct] = useState(data ? data : [{}]);

  const { addToCart, AutoHeader } = useContext(AuthContext);
  const { setAdditonalContent } = useContext(HeaderContext);
  useEffect(() => {
    async function getProduct() {
      try {
        const params = search ? search : searchParams;
        const head = AutoHeader();
        const response = await fetch(
          `http://localhost:3000/api/item/search?${createSearchParams(params)}`,
          {
            header: head,
            method: "POST",
            body: {
              search_text: params["search_text"],
              tags: params["tags"],
            },
          }
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {}
    }
    // if just displaying data, do just that instead of searching
    if (!data) {
      getProduct();
      setAdditonalContent(
        <h1 className="merriweather-regular">{headerText}</h1>
      );
    } else {
      setProduct(data);
    }
  }, [search ? search : searchParams, data && data, headerText]);

  function generateCard(obj) {
    return (
      <div className="item-card">
        <div>
          <img
            src={obj.default_photo}
            alt="Default Item Card Photo"
            className="square"
          />
          <p className="merriweather-regular relative-left-corner ">
            ${obj.price}
          </p>
        </div>

        <div className="flex-v">
          <a
            className="merriweather-black dark-text"
            href={`http://localhost:5173/products/${obj.id}`}
          >
            {obj.name}
          </a>
          <button
            className="three-d-button merriweather-bold"
            onClick={() => {
              addToCart(obj.id);
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`flex-v ${
        !data && !search ? "centered scroll-y " : "products"
      }`}
    >
      <DisplayMany
        data={products}
        factory={generateCard}
        additionalClasses={"stretch wrap "}
      />
    </div>
  );
}

// setState searchTags, should be an array of strings. Remember getting params from paths in the puppy bowl? That might be the best way to pass data from searchbar to products. Based on my testing on other sites, that seems to be how searches are done too.
// But for now, DO NOT concern yourself with this. Rather, focus on what happens when just the product page is navigated to.
// in useEffect, make a fetch get call to items
// make a useState to store the data got back
// pass down the data to display

// pass down function making product cards to display many
/// consult the searchParams Views / Products Page on our mockframe for how it should look
// to see an example of how to use DisplayMany, look at SearchBar, where it is used to handle tags

export default Products;
