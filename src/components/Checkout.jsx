import { AuthContext } from "./AuthContext";
import React, { useContext, useState, useEffect } from "react";
import Cart from "./Cart";
import OrderConfirmation from "./OrderConfirmation";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
// import { StripeProvider } from '@stripe/stripe-react-native';
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_51Q0LdjJFsQYrrxOA8E1Mgkyzknj11Gby2Qgf3mI9XdnRRko6G135tdate7BdeXYfk8FEzd1yokda5iPj0YFFAfCr00iGWB7kDL');
// import {loadStripe} from '@stripe/stripe-js';
// const stripe = loadStripe("pk_test_51Q0LdjJFsQYrrxOA8E1Mgkyzknj11Gby2Qgf3mI9XdnRRko6G135tdate7BdeXYfk8FEzd1yokda5iPj0YFFAfCr00iGWB7kDL", {
//   betas: ['custom_checkout_beta_3'],
// });
import FormGenerator from "./FormGenerator";
import Dropdown from "./Dropdown";

import DisplayMany from "./DisplayMany";

function Checkout({ props }) {
  const { token, getUser } = useContext(AuthContext);
  //compressed down to these two fields holding the object from the forms
  const [address, setAddress] = useState({});
  const [creditCard, setCreditCard] = useState({});
  // const [error, setError] = useState(null);
  // Related To Summary
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [cart, setCart] = useState({ mapped: {} });
  const [user, setUser] = useState(false);
  const addressFields = [
    { key: "zip", type: "number" },
    { key: "street", type: "text" },
    { key: "apartment", type: "text" },
    { key: "hi ", type: "text", default:"aaggggggggggggg"  },
    { key: "yo sujoy", type: "text", default:"aaaa" },
    { key: "hiii sujoy", type: "text", default:"uwuwuuwuwuuw" }
  ];
  const creditCardFields = [
    { key: "pin", type: "number" },
    { key: "exp_date", type: "month" },
    { key: "cvc", type: "number" },
  ];
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
    console.log(cart);
    const quantity = Object.values(cart.item_dict).reduce(
      (acc, currentQty) => acc + currentQty,
      0
    );
    setAmount(quantity);
    setTotal(cart.total_cost);
    setCart(cart);
  }
  function summarizeItem(obj) {
    return (
      <p>
        {obj.name}({obj.quantity}) - ${obj.quantity * obj.price}
      </p>
    );
  }
  //   const API = "http://localhost:3000/api/stripe/"
  useEffect(() => {
    const getMe = async () => {
      const user = await getUser();
      console.log(user);
      console.log(user.shopping_cart);
      // setCart(user.shopping_cart)
      setUser(user);
    };
    getMe();
  }, []);
  return (
    <div className="split-screen fill-screen flex-h">
      <div className="checkout">
        <Dropdown label="Credit Card">
          <FormGenerator
            fields={addressFields}
            postSuccessFunction={(obj) => {
              setAddress(obj);
            }}
          />
        </Dropdown>
        <Dropdown label="Address">
          <FormGenerator
            fields={creditCardFields}
            postSuccessFunction={(obj) => {
              setCreditCard(obj);
            }}
          />
        </Dropdown>
        <Dropdown label="Summary">
          <DisplayMany
            data={cart.mapped}
            factory={summarizeItem}
            additionalClasses="flex-v"
          />
          <hr />
          <p className="merriweather-bold">Total: ${total}</p>
          <hr />
          <button className="three-d-button">Checkout</button>
        </Dropdown>
      </div>
      <Cart user_id={12} cart_id={12} passUpCart={updateCheckout} />
    </div>
  );
}
export default Checkout;
