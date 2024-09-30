import React, { useContext, useState,useEffect } from "react";
import { AuthContext } from "./AuthContext";
import DisplayMany from "./DisplayMany";
function Cart({shopping_cart, cart_id=12, passUpCart}) {
  const {addToCart,removeFromCart,modifyCart,mapItemDictToObjArray} = useContext(AuthContext);
  const [cart, setCart] = useState([{
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

  useEffect(() => {
    async function fetchCart() {
      // skip step if cart is set
      if (shopping_cart){processCartUpdate(shopping_cart); return;}
      // get cart
      try {
        // will need to add check to see if admin and if so let get happen regardless
        const res = await fetch(`http://localhost:3000/api/shopping_cart/${cart_id}`);
        const fetched_cart = await res.json();
        // modify gotten cart
        if (res.ok) {
          console.log(fetched_cart);
          // put cart into function to convert it to readable by the factory function for DisplayMany
          processCartUpdate(fetched_cart)
        }
        return fetched_cart
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
    fetchCart()
  },
  [] );
async function processCartUpdate(cart) {
  const mappped = await mapItemDictToObjArray(cart.item_dict)
  setCart(mappped)
  // if cart data needs to be passed back up, it will be done so here
  if (passUpCart){
    // mapped is added onto this data just in case
    cart["mapped"] = mappped
    // lets add some other stuuf too
    passUpCart(cart)
  }
}
function generateCard(obj){
  return(
    <div className="cart-card flex-h">
      <img src={obj.default_photo} className="cover"></img>
      <div className="info flex-v"><p>${obj.price}</p><p>{obj.name}</p>
      <div className="flex-h button-box">
      <button onClick={async()=>{const newCart = await removeFromCart(obj.id);processCartUpdate(newCart)}}>-</button>
        <input type="number" value={obj.quantity} onInput={async(e)=>{console.log(e.target);
        const modBy = obj.quantity > e.target.value ? -1:1;
        const newCart = await modifyCart(obj.id,modBy);
        processCartUpdate(newCart)}}></input>
        <button onClick={async()=>{const newCart = await addToCart(obj.id); processCartUpdate(newCart)}}>+</button>
      </div>
    </div>
    </div>

  )
}
  return (
<div className="flex-v cart">
      <h1>YOUR CART</h1>
      <DisplayMany data={cart} factory={generateCard} emptyDataText="Your cart is empty." additionalClasses={"scroll-y"}/>
    </div>
  );
}
export default Cart;