import React, { useContext, useState,useEffect } from "react";
import { AuthContext } from "./AuthContext";
// import { useSelector, useDispatch } from "react-redux";
// const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
// require("dotenv").config();
import DisplayMany from "./DisplayMany";
function Cart(user_id=12,cart_id=12) {
  const {addToCart,removeFromCart,modifyCart} = useContext(AuthContext);
  // const [data, setData] = useState([{}]);
  const [cart, setCart] = useState(     {
    id: 12,
    user_id: 12, // User l
    item_dict:{3:2,1:2}, // $20 Roger Rabbit Shirt x 3 , $5 Tulum Dress x 2
    total_cost: 50,
  });


  //INCOMPLETE CODE SOMETHING IS NOT COMPLETE IN THE TRY SECTION OF THE CODE
  useEffect(() => {
    async function mapCartToDisplay(item_dict) {
      const cartArr = []
      try {
        for (const id in item_dict) {
          //get item by id
          const res = await fetch(`http://localhost:3000/api/item/${id}`);
          // throw if missing
          if (!res.ok){throw Error("ITEM MISSING")}
          const item = await res.json();
          // add quantity of item in cart to obj
          item["quantity"] = item_dict[id]
          cartArr.push(item)
        }
      } catch (error) {
        console.error(error)
      }
      setCart(cartArr)
    }
    async function fetchCart() {
      // get cart
      try {
        // will need to add check to see if admin and if so let get happen regardless
        const res = await fetch(`http://localhost:3000/api/shopping_cart/${user_id}/${cart_id}`);
        const fetched_cart = await res.json();
        // modify gotten cart
        if (res.ok) {
          console.log(fetched_cart);
          // put cart into function to convert it to readable by the factory function for DisplayMany
          mapCartToDisplay(fetched_cart)
        }
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
  },[cart]);
function generateCard(obj){
  // const [cart, setCart] = useState([{}]);
  return(
    <div className="cart-card">
      <img src={obj.default_photo}></img>
      <div className="info"><p>${obj.price}</p><p>{obj.name}</p>
      <div>
      <button onClick={()=>{removeFromCart(1)}}>-</button>
        {/* <input type="number" onInput={(e)=>{modifyCart(e.target[0].value)}}></input> */}
        <p>{obj.quantity}</p>
        <button onClick={()=>{addToCart(1)}}>+</button>
        </div>
      </div>
    </div>
  )
}
  return (
<div>
      <h1>YOUR CART</h1>
      <DisplayMany data={cart} factory={generateCard} emptyDataText="Your cart is empty."/>
    </div>
  );
}
export default Cart;