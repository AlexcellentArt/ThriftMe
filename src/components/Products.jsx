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
import Favorite from "./Favorite";
function Products() {
  const nav = useNavigate();
  // const [tags, setTags]= useState([{}]);
  // let [searchParams,setSearch] = useSearchParams();
  const { searchParams } = useContext(SearchContext);
  const [products, setProduct] = useState([{}]);

  const { addToCart, AutoHeader } = useContext(AuthContext);

  useEffect(() => {
    async function getProduct() {
      try {
        // const query = {"search_text":searchParams.get("search_text"),"tags":searchParams.get("tags")}
        // console.log("query")
        // console.log(query)
        const head = AutoHeader();
        const response = await fetch(
          `http://localhost:3000/api/item/search?${createSearchParams(
            searchParams
          )}`,
          {
            header: head,
            method: "POST",
            body: {
              search_text: searchParams["search_text"],
              tags: searchParams["tags"],
            },
          }
        );
        console.log("responedse");
        const data = await response.json();
        console.log(data);
        setProduct(data);
        console.log(products);
      } catch (error) {
        console.log(
          "Looks like I can't display your page,when I fetched from API it did not work"
        );
        console.error(error);
      }
    }
    getProduct();
  }, [searchParams]);
  

  function generateCard(obj) {
    return (
      <div className="item-card">
        <div>
          {/* <Favorite id={obj.id} /> */}
          <img
            src={obj.default_photo}
            alt="Default Item Card Photo"
            className="square"
          />
          <p className="merriweather-regular relative-left-corner ">${obj.price}</p>
        </div>

        <div className="flex-v">
          <a className="merriweather-black" href={`http://localhost:5173/products/${obj.id}`}>{obj.name}</a>
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
    <div className="flex-v scroll-y">
    <div className="fixed force-fill-width dark-bg">

    <h1 className="merriweather-regular">Products</h1>
</div>
    <DisplayMany data={products} factory={generateCard}         additionalClasses={"stretch wrap "}
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
