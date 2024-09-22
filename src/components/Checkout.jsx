import { AuthContext } from "./AuthContext";
import React, { useContext, useState, useEffect } from "react";
import Cart from "./Cart";
import OrderConfirmation from "./OrderConfirmation";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
import Dropdown from "./Dropdown";

import DisplayMany from "./DisplayMany";

function Checkout({props}){
  const { token } = useContext(AuthContext);
  // see if I can't fix this to use form generator
  //   const stripe = useStripe();
  //   const elements = useElements();
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  // Related To Summary
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [cart, setCart] = useState({mapped:{}});
  const makePayment = async () => {
    // const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
    const body = {
      products: cart,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    // const response = await fetch(`${apiURL}/create-checkout-session`, {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify(body),
    // });
    // const session = await response.json();
    // const result = stripe.redirectToCheckout({ sessionId: session.id });
    // if (result.error) {
    //   console.log(result.error);
    // }
  };
  function updateCheckout(cart) {
    console.log("update checkout:");
    console.log(cart)
    const quantity = Object.values(cart.item_dict).reduce((acc, currentQty) => acc + currentQty,
    0)
    setAmount(quantity)
    setTotal(cart.total_cost);
    setCart(cart)
  }
  function summarizeItem(obj) {
    return (<p>{obj.name}({obj.quantity}) - ${obj.quantity*obj.price}</p>)
  }
  return (
    // <Elements stripe={stripePromise} options={options}>
    <div className="split-screen fill-screen flex-h">
      <div className="checkout">
        <Dropdown label="Credit Card">TBM</Dropdown>
        <Dropdown label="Address">TBM</Dropdown>
        <Dropdown label="Summary">
          <DisplayMany data={cart.mapped} factory={summarizeItem} additionalClasses="flex-v"/>
          <hr />
          <p className="merriweather-bold">Total: ${total}</p>
          <hr />
        <button className="three-d-button">Checkout</button>
        </Dropdown>
      </div>
      <Cart user_id={12} cart_id={12} passUpCart={updateCheckout} />
    </div>
    // </Elements>
  );
}
export default Checkout;