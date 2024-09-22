import React, { useContext, useState,useEffect } from "react";
import { AuthContext } from "./AuthContext";
import DisplayMany from "./DisplayMany";
function Cart(user_id=12,cart_id=12) {
  const {addToCart,removeFromCart,modifyCart,mapItemDictToObjArray} = useContext(AuthContext);
  // const [data, setData] = useState([{}]);
  const [cart, setCart] = useState([      {
    seller_id: 1,
    name: "Tulum Dress",
    price: 5,
    description: "Perfect 2 piece dress for Tulum",
    default_photo:
      "https://shopannalaura.com/cdn/shop/products/paradisemaxidress2.jpg?v=1628458759&width=1445",
    additional_photos: [""],
    tags: ["tulum", "summer", "dress","women's fashion"],
    quantity:6
  }]);

  // useEffect (()=>{

  //   async function getProduct(){
  //     try{
  //       const response= await fetch
  //       ("http://localhost:3000/api/item",);
  //       const data= await response.json();
  //       console.log(data);
  //       setProduct(data);
  //       console.log(products);

  //     }
  //    catch (error) {
  //     console.log(
  //     "Looks like I can't display your page,when I fetched from API it did not work");
  //     // console.error(error);
  //     }
  //   }
  //   getProduct(); },
  //    [] );
  //INCOMPLETE CODE SOMETHING IS NOT COMPLETE IN THE TRY SECTION OF THE CODE
  useEffect(() => {
    async function fetchCart() {
      // get cart
      try {
        // will need to add check to see if admin and if so let get happen regardless
        const res = await fetch(`http://localhost:3000/api/shopping_cart/${12}/${12}`);
        const fetched_cart = await res.json();
        // modify gotten cart
        if (res.ok) {
          console.log(fetched_cart);
          // put cart into function to convert it to readable by the factory function for DisplayMany
          const mappped = await mapItemDictToObjArray(fetched_cart.item_dict)
          setCart(mappped)
        }
        return fetched_cart
      } catch (error) {
        console.error(error);
      }
    }
    // const LoadPage = async () => {
    //   try {
    //     const res = await fetch(`${apiURL}/cart`, {
    //       method: "GET",
    //       headers: { "Content-Type": "application/json" },
    //     });
    //     //INCOMPLETE SECTION HERE!!!!!!!!
    //   } catch (error) {
    //     console.error("Failed to load cart:", error);
    //   }
    // };
    fetchCart()
  },
  [] );
async function processCartUpdate(item_dict) {
  const mappped = await mapItemDictToObjArray(item_dict)
  setCart(mappped)
}
function generateCard(obj){
  return(
    <div className="cart-card flex-h">
      <img src={obj.default_photo} className="cover"></img>
      <div className="info flex-v"><p>${obj.price}</p><p>{obj.name}</p>
      <div className="flex-h button-box">
      <button onClick={async()=>{const modded = await removeFromCart(obj.id);processCartUpdate(modded.item_dict)}}>-</button>
        <input type="number" value={obj.quantity} onInput={(e)=>{modifyCart(e.target[0].value)}}></input>
        {/* <div><p>{obj.quantity}</p></div> */}
        <button onClick={async()=>{const modded = await addToCart(obj.id); processCartUpdate(modded.item_dict)}}>+</button>
      </div>
    </div>
    </div>

  )
}
  return (
<div className="flex-v fill-screen cart">
      <h1>YOUR CART</h1>
      <DisplayMany data={cart} factory={generateCard} emptyDataText="Your cart is empty." additionalClasses={"scroll-y"}/>
    </div>
  );
}
export default Cart;