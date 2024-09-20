import React, { useContext, useState,useReducer,useEffect } from "react";
import { AuthContext } from "./AuthContext";
// import { useSelector, useDispatch } from "react-redux";
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
// const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
// require("dotenv").config();
function Cart() {
  const {token,addToCart,removeFromCart,getUser} = useContext(AuthContext);

  // const cart = useSelector((state) => state.AddToCart);
  //to clear or update cart
  // const dispatch = useDispatch();
  // const Navigate = useNavigate();
  // const [cart, dispatch] = useReducer(
  //   cartDataReducer,
  //   createInitialValues()
  // );
  // function createInitialValues(initialValue = "") {
  //   const obj = {
  //     id: 7,
  //     user_id:7,
  //     item_dict:{3:4,1:2}, // $20 Roger Rabbit Shirt x 4, $10 Hawaii Shirt x 2
  //     total_cost: 90,
  //   }
  //   // fetch cart data of user
  //   return obj;
  // }

  // async function handleResetFormData() {
  //   await dispatch({
  //     type: "reset",
  //   });
  // }
  // async function mapCartToUI(){
  //   return await dispatch({
  //     type:"mapToUI"
  //   })
  // }
  // function cartDataReducer(data, action) {
  //   console.log(data)
  //   switch (action.type) {
  //     case "map":{
  //       Object.keys(data)
  //       const mapped = Object.keys(data).map((key) =>
  //        { const item = data[key]
  //         return (<li key={item.id}>
  //           <img src={item.image} />
  //           <h2>{item.name}</h2>
  //           <p>Price: ${item.price}</p>
  //           <p>Quantity: {item.quantity}</p>
  //         </li>)
  //         })
  //       return mapped
  //     }
  //     case "update": {
  //       // make fetch request to shopping cart api to get data
  //       return data;
  //     }
  //     case "reset": {
  //       // make delete or put with empty object to cart api
  //       return data;
  //     }
  //     default: {
  //       throw Error("Unknown action: " + action.type);
  //     }
  //   }
  // }
  // // stripe for card payments
  // const stripe = useStripe();
  // const elements = useElements();
  // const [city, setCity] = useState("");
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [address, setAddress] = useState("");
  // const [error, setError] = useState(null);
  // //function to calculate total ot items in cart
  // const calculateTotal = () => {
  //   return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  // };
  // //INCOMPLETE CODE SOMETHING IS NOT COMPLETE IN THE TRY SECTION OF THE CODE
  // useEffect(() => {
  //   const LoadPage = async () => {
  //     try {
  //       const res = await fetch(`${apiURL}/cart`, {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       });
  //       //INCOMPLETE SECTION HERE!!!!!!!!
  //     } catch (error) {
  //       console.error("Failed to load cart:", error);
  //     }
  //   };
  // });
  // const makePayment = async () => {
  //   const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
  //   const body = {
  //     products: cart,
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };
  //   const response = await fetch(`${apiURL}/create-checkout-session`, {
  //     method: "POST",
  //     headers: headers,
  //     body: JSON.stringify(body),
  //   });
  //   const session = await response.json();
  //   const result = stripe.redirectToCheckout({ sessionId: session.id });
  //   if (result.error) {
  //     console.log(result.error);
  //   }
  // };
  return (
<div>
      <h1>YOUR CART</h1>
      <button onClick={()=>{addToCart(1)}}>ADD TO CART</button>
      <button onClick={()=>{removeFromCart(1)}}>REMOVE FROM CART</button>

      {/* {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {Object.keys(cart).map((key) =>
         { const item = cart[key]
          return (<li key={item.id}>
            <img src={item.image} />
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </li>)
          })}
        </ul>
      )}
      <h2>Total: ${calculateTotal().toFixed(2)}</h2>{" "}
      <button onClick={makePayment}>Proceed to Checkout</button>{" "} */}
    </div>
  );
}
export default Cart;