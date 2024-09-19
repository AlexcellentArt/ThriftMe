import DisplayMany from "./DisplayMany";
import { useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import React from "react";
import { useEffect } from "react";

function Products() {
    const [tags, setTags]= useState([{}]);

    const [products, setProduct]= useState([{}]);

    useEffect (()=>{

      async function getProduct(){
        try{ 
          const response= await fetch 
          ("http://localhost:3000/api/item",
            // {mode: 'no-cors',}
          );
          const data= await response.json();
          console.log(data);
          setProduct(data);
          console.log(products);
  
        }    
       catch (error) {
        console.log(
        "Looks like I can't display your page,when I fetched from API it did not work");
        console.error(error);
      
        }
      
      }
      getProduct(); },
       [] );

     function generateCard(obj){

      return(<div
      className="Item_Card"
      >
        <div>
          <button
          className="Favorites"
          onClick={()=> {addFavorites();}}
          >Add To Favorites

          </button>
          <img src={obj.default_photo} alt="Default Item Card Photo" />
        <p>{obj.price}</p>

        </div>
        


        <div>
        <p>{obj.name}</p>
        <button
        className="Adding_Button"
        onClick={() => {addItem();}}>Add To Cart 
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