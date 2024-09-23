import DisplayMany from "./DisplayMany";
import { useState,useContext} from "react";
import { useParams,useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";

function Products() {
  const nav = useNavigate()
    const [tags, setTags]= useState([{}]);

    const [products, setProduct]= useState([{}]);

    const {toggleFavorite, addToCart} = useContext(AuthContext)

    useEffect (()=>{

      async function getProduct(){
        try{
          const response= await fetch
          ("http://localhost:3000/api/item",);
          const data= await response.json();
          console.log(data);
          setProduct(data);
          console.log(products);
  
        }
       catch (error) {
        console.log(
        "Looks like I can't display your page,when I fetched from API it did not work");
        // console.error(error);
        }
      }
      getProduct(); },
       [] );

     function generateCard(obj){

      return(<div
      className="item-card"
      >
        <div>
          <button
          className="Favorites" onClick={()=> {toggleFavorite(obj.id);}}
          >Add To Favorites
          </button>
          <img src={obj.default_photo} alt="Default Item Card Photo" className="square"/>
        <p>${obj.price}</p>
        </div>

        <div>
          
        <a href={`http://localhost:5173/products/${obj.id}`}>{obj.name}</a>
        {/* <p>{obj.name}</p> */}
        <button
        className="three-d-button"
        onClick={() => {addToCart(obj.id);}}>Add To Cart 
        </button>
        </div>
      


      </div>)
      


     }
      return (<div>Products<DisplayMany data={products} factory={generateCard}/></div>);

    };


  


  

  

    // setState searchTags, should be an array of strings. Remember getting params from paths in the puppy bowl? That might be the best way to pass data from searchbar to products. Based on my testing on other sites, that seems to be how searches are done too. 
    // But for now, DO NOT concern yourself with this. Rather, focus on what happens when just the product page is navigated to.
    // in useEffect, make a fetch get call to items
    // make a useState to store the data got back
    // pass down the data to display

    // pass down function making product cards to display many
    /// consult the Search Views / Products Page on our mockframe for how it should look
    // to see an example of how to use DisplayMany, look at SearchBar, where it is used to handle tags



export default Products;