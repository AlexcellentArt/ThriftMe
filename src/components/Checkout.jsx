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
import Login from "./Login";
import Register from "./Register";
import FormGenerator from "./FormGenerator";
import Dropdown from "./Dropdown";

import DisplayMany from "./DisplayMany";
// import SelectionGenerator from "./SelectionGenerator";

function Checkout({ props }) {
  const { token, getUser, cartToken } = useContext(AuthContext);
  const [isGuest, setIsGuest] = useState(true);
  // raw user data
  const [user, setUser] = useState({
    credit_cards: [],
    addresses: [],
    shopping_cart: { item_dict: {} },
  });

  //  cart data with the fetched items and them mapped
  const [cart, setCart] = useState({ mapped: {} });
  // Related To Summary
  // total is the total price of all items in the cart
  const [total, setTotal] = useState(0);
  // amount is NOT FOR PRICE, it's for the amount of items total in the cart
  const [amount, setAmount] = useState(0);
// info that needs to get passed to order confirmation
  const [address, setAddress] = useState({});
  const [creditCard, setCreditCard] = useState({});
// Fields for generating the forms
  const [addressFields, setAddressFields] = useState([
    { key: "zip", type: "number" },
    { key: "state", type: "text", default: "aaa" },
    { key: "city", type: "text" },
    { key: "street", type: "text" },
    { key: "apartment", type: "number" },
  ]);
  const [creditCardFields, setCreditCardFields] = useState([
    { key: "pin", type: "text" },
    { key: "exp_date", type: "text" },
    { key: "cvc", type: "number" },
  ]);
  useEffect(() => {
    const getMe = async () => {
      const user = await getUser();
      if (user === undefined) {
        const guest = {
          credit_cards: [],
          addresses: [],
          shopping_cart: { item_dict: {} },
        };
        const response = await fetch(
          `http://localhost:3000/api/shopping_cart/${cartToken}`
        );
        if (response.ok) {
          console.log("CART FOUND AND NO USER");
          guest.shopping_cart = await response.json();
          return;
        }
        setUser(guest);
      } else {
        setUser(user);
        setIsGuest(false);
      }
    };
    getMe();
  }, [token]);

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
  function formatAddress(obj) {
    return (
      obj.street + `${obj.apartment && obj.apartment}` + obj.city + `${obj.zip}`
    );
  }
  function formatCreditCard(obj) {
    return `${obj.pin} ${obj.exp_date} ${obj.cvc}`;
  }
  function GoToOrderConfirmation(obj){
    // insert logic here navigating/passing data to order confirmation
    // that's the stage then where a new past transaction would be made.
    // I've assembled here everything I think might be needed to make a past transaction, which we can have created at the OrderConfirmation page with this data funneled into it somehow.
    const OrderInfo = {cart:shopping_cart,address:address,credit:creditCard,total:total}
    // since we don't have a stripe backend, we could probably get away with just going visually 'charge made, shipping to x, but not actually saving the address and card.
    // OR, we can add shipping address and charged card to the schema. Maybe a receiving card for the money to be transferred to for the seller too.
    // If alive, talk to team about it tomorrow.
    //
  }
  return (
    <div className="split-screen fill-screen flex-h">
      <div className="checkout">
        {isGuest === true ? (
          <Dropdown label="Login Or Register To Continue Checkout">
            <div className="flex-h">
              <Login stayOnPage={true} />
              <Register stayOnPage={true} />
            </div>
          </Dropdown>
        ) : (
          <>
            <Dropdown label="Credit Card">
              {Object.keys(creditCard).length > 2 ? (
                <>
                  {" "}
                  <p>Selected Credit Card:{formatCreditCard(creditCard)}</p>
                  <button
                    className="medium-text"
                    onClick={() => {
                      setCreditCard({});
                    }}
                  >
                    Clear
                  </button>
                </>
              ) : (
                <FormGenerator
                  fields={creditCardFields}
                  autofillOptions={user ? user.credit_cards : undefined}
                  postSuccessFunction={(obj) => {
                    setCreditCard(obj);
                  }}
                  autoFillOptionFormatter={(obj) => {
                    return {
                      value: obj,
                      text: `${obj.pin} ${obj.exp_date}`.trim(),
                    };
                  }}
                />
              )}
            </Dropdown>

            <Dropdown label="Credit Card">
              {Object.keys(creditCard).length > 2 ? (
                <>
                  <p>Selected Address:{formatAddress(address)}</p>
                  <button
                    className="medium-text"
                    onClick={() => {
                      setAddress({});
                    }}
                  >
                    Clear
                  </button>
                </>
              ) : (
                <FormGenerator
                  fields={addressFields}
                  postSuccessFunction={(obj) => {
                    setAddress(obj);
                  }}
                  autoFillOptionFormatter={(obj) => {
                    return { value: obj, text: formatAddress(obj) };
                  }}
                  autofillOptions={user ? user.addresses : undefined}
                />
              )}
            </Dropdown>
          </>
        )}
        {cart.mapped.length < 0 ? (
          <h2>Nothing To Checkout</h2>
        ) : (
          <Dropdown label="Summary">
            <p>
              Selected Credit Card:
              {Object.keys(creditCard).length > 2 ? (
                formatCreditCard(creditCard)
              ) : (
                <span className="error">Needs Filling Out</span>
              )}
            </p>
            <p>
              Selected Address:
              {Object.keys(address).length > 4 ? (
                formatAddress(address)
              ) : (
                <span className="error">Needs Filling Out</span>
              )}
            </p>
            <DisplayMany
              data={cart.mapped}
              factory={summarizeItem}
              additionalClasses="flex-v"
            />
            <hr />
            <p className="merriweather-bold">Total: ${total}</p>
            <hr />
            {creditCard && address != null && (
              <button className="three-d-button" onClick={()=>{GoToOrderConfirmation()}}>Checkout</button>
            )}
          </Dropdown>
        )}
      </div>
      <Cart shopping_cart={user.shopping_cart} passUpCart={updateCheckout} />
    </div>
  );
}
export default Checkout;
