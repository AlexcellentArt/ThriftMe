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
  const { token, getUser,cartToken } = useContext(AuthContext);
  //compressed down to these two fields holding the object from the forms
  // const [addresses, setAddresses] = useState({});
  // const [creditCards, setCreditCards] = useState({});
  const [address, setAddress] = useState({});
  const [creditCard, setCreditCard] = useState({});
  // const [error, setError] = useState(null);
  // Related To Summary
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [cart, setCart] = useState({ mapped: {} });
  const [user, setUser] = useState({credit_cards:[],addresses:[],shopping_cart:{item_dict:{}}});

  const [addressFields, setAddressFields] = useState([
    { key: "zip", type: "number" },
    { key: "state", type: "text" },
    { key: "city", type: "text" },
    { key: "street", type: "text" },
    { key: "apartment", type: "number" }]
  );
  const [creditCardFields, setCreditCardFields] = useState([
    { key: "pin", type: "number" },
    { key: "exp_date", type: "month" },
    { key: "cvc", type: "number" },
  ]);
  useEffect(() => {
    const getMe = async () => {
      const user = await getUser();
      if (!user){
        const guest = {credit_cards:[],addresses:[],shopping_cart:{item_dict:{}}};
                  const response = await fetch(`http://localhost:3000/api/shopping_cart/${cartToken}`)
                  if (response.ok)
                  {
                    console.log("CART FOUND AND NO USER")
                    guest.shopping_cart = await response.json()
                    return
                  }
        setUser(guest)}
      // console.log(user);
      // console.log(user.shopping_cart);
      // console.log("Seller Transactions:",user.past_transactions_seller)
      // console.log("Buyer Transactions:",user.past_transactions_buyer)
      // console.log("Buyer Transaction 1 Total Cost:",user.past_transactions_buyer[0].total_cost)
      // setAddresses(user.address)
      // setCreditCards(user.credit_card)
      setUser(user);
    };
    getMe();
  }, []);
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
  function autoFill(obj,fields,setterFunc){
    const filled = fields.map((field)=>{
      // see if object has key matching field
      const idx = obj.findIndex(field.key)
      if (idx != -1)
      {
        // if so, add default to the field and set it equal to the object's value
        field["default"] = obj.value
      }
      return field
    })
    // if setterFunc, use that, and just in case something wants this, return the filled form obj as well
    if (setterFunc){setterFunc(filled)}
    return filled
  }
  // function autoFillCreditCard(){}
  // function autoFillAddress(){}

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
function selectionBar(label,options,handleChange)
{
  return ( <select name={label} id={`${label}-select`}>
      {options.map((obj)=>{return <option value={obj.value}>{obj.text ? obj.text:obj.value}</option>})}
    </select>)
}
  return (
    <div className="split-screen fill-screen flex-h">
      <div className="checkout">
        <Dropdown label="Credit Card">
          <button onClick={()=>{autoFill()}}>Autofill</button>
          {selectionBar({label:"aaa"},[{value:"aaa",text:"uwuwu"},{value:"waaa"}])}
          {/* {user && <FormGenerator fields={{ key: "credit_card", type: "select",options:user.credit_cards} }postSuccessFunction={(obj)=>{autoFill(obj,creditCardFields,setCreditCardFields)}}/>} */}
          <FormGenerator
            fields={addressFields}
            postSuccessFunction={(obj) => {
              setAddress(obj);
            }}
          />
        </Dropdown>
        <Dropdown label="Address">
       {/* {user && <FormGenerator fields={{ key: "address", type: "select",options:[...user.addresses]} }postSuccessFunction={(obj)=>{autoFill(obj,addressFields,setAddressFields)}}/>}
          <FormGenerator
            fields={creditCardFields}
            postSuccessFunction={(obj) => {
              setCreditCard(obj);
            }}
          /> */}
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
      {/* <Cart shopping_cart={user.shopping_cart} passUpCart={updateCheckout} /> */}
    </div>
  );
}
export default Checkout;
