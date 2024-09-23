import DisplayMany from "./DisplayMany";
import { useState,useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";




function Home() {

    const navigate = useNavigate();


const [normal, updated_normal_page]= useState();
const user_id= 2;
useEffect(()=> {


    async function getTrendyProducts() {
        const browsing_history= await fetch 
        (`http://localhost:3000/browsing_history/${user_id}`, {body: {"search_text":'', "tags":[],}})

        for(let index=0; index<browsing_history.tags.length; index++){
      
           
            try{
                const response= await fetch ("http://localhost:3000/api/item/search", {body:{ "tags":[tag],}});
                const data= await response.json();
                console.log(data);
                getTrendyProducts(data);
                console.log(products);
            }
            catch(error){
                console.log("Looks Like your home page is not displaying")
            }
        }
    }

getTrendyProducts(); }),

        

        

function generateCard(obj){

    return(<div
    className="item-card"
    >
      <div>
        <button
        className="three-d-button" onClick={()=> {toggleFavorite(obj.id);}}
        >Add To Favorites
        </button>
        <img src={obj.default_photo} alt="Default Item Card Photo" className="square"/>
      <p>${obj.price}</p>
      </div>

      <div>
        
      <a href={`http://localhost:5173/products/${obj.id}`}>{obj.name}</a>
      {/* <p>{obj.name}</p> */}
      <button
      className="adding-button"
      onClick={() => {addToCart(obj.id);}}>Add To Cart 
      </button>
      </div>
    


    </div>)
    


   }
    return (<div>Products<DisplayMany data={products} factory={generateCard}/></div>);

  };
   
    

    
export default Home;