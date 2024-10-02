import { AuthContext } from "./AuthContext";
import { HeaderContext } from "./HeaderContext";
import React, { useContext, useState, useEffect } from "react";
import Cart from "./Cart";
import OrderConfirmation from "./OrderConfirmation";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import FormGenerator from "./FormGenerator";
import Dropdown from "./Dropdown";
import DisplayMany from "./DisplayMany";
function Checkout({ props }) {
  const { token, getUser, cartToken,AutoHeader,clearCart } = useContext(AuthContext)
  const {setAdditonalContent} =useContext(HeaderContext)
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
  const nav = useNavigate();

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
          console.log(guest)
          setUser(guest)
          return;
        }
      } else {
        setUser(user);
        // set defaults
        
        setIsGuest(false);
      }
    };
    getMe();
    setAdditonalContent(    <h1 className="merriweather-regular">CHECKOUT</h1>
      )
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
      obj.street + ` ${obj.apartment && obj.apartment} ` + obj.city + ` ${obj.zip}`
    );
  }
  function formatCreditCard(obj) {
    return `${obj.pin} ${obj.exp_date} ${obj.cvc}`;
  }
  async function makePastTransactions(){
    // const base = {seller_id,buyer_id,item_dict,total_cost,tags}
    // first, break up the cart by seller
    const sellers = {}
    console.log(cart.mapped)
    cart.mapped.forEach(item => {
      if (sellers[item.seller_id]){
        sellers[item.seller_id].push(item)
      }
      else{
        sellers[item.seller_id] = [item]
      }
    });
    console.log(sellers)
    // make transaction obj for each seller
    let assembled = []
    const mappedBySeller = {}
    for (const [seller, items] of Object.entries(sellers)) {
      assembled.push({transaction:assembleTransaction(seller,items),mapped_items:items})
    }
    console.log(assembled)
    // clear cart (will impliment after confirming this works)
    // make transactions
    // got to order confirmation
    const header = AutoHeader()
    const made = []
    for (let i = 0; i < assembled.length; i++) {
      try {
        const transaction = assembled[i].transaction
        console.log("trying to make transaction",transaction)
        const res = await fetch(`http://localhost:3000/api/past_transactions/checkout`,{headers:header,body:JSON.stringify(transaction),method:"POST"});
        if (res.ok){
          console.log("TRANSACTION MADE")
          const json = await res.json()
          // add the mapped item info onto it
          json["items"] = assembled[i].mapped_items
          made.push(json)
        }
        else{
          throw new Error("POST FAIL")
        }
      } catch (error) {
        console.error(error)
      }
    }
    // clear cart
    // await clearCart()
    console.log(made)
    GoToOrderConfirmation(made)
  }
  function assembleTransaction(id,array){
    // cvc is not saved as that is illegal.
    const add = formatAddress(address)
    const base = {seller_id:Number(id),buyer_id:user.id,shipping_address:add,paying_card:`${creditCard.pin} ${creditCard.exp_date}`,item_dict:{},total_cost:0,tags:[]}
    let price = 0
    // reduplicate below logic for only adding unique tags to browsing history
    array.forEach((item)=>{
      base.item_dict[`${item.id}`]=item.quantity
      price += item.quantity*item.price
      item.tags.forEach((tag)=>{if (!base.tags.includes(tag)){base.tags.push(tag)}})
    })
    // base.item_dict = JSON.stringify(base.item_dict)
    base.total_cost = price
    return base
  }
  function GoToOrderConfirmation(transactions){
    // insert logic here navigating/passing data to order confirmation
    // that's the stage then where a new past transaction would be made.
    // I've assembled here everything I think might be needed to make a past transaction, which we can have created at the OrderConfirmation page with this data funneled into it somehow.
    const OrderInfo = {"state":{name:user.name,address:formatAddress(address),credit:formatCreditCard(creditCard),orders:transactions,total:total}}
    console.log(OrderInfo)
    // since we don't have a stripe backend, we could probably get away with just going visually 'charge made, shipping to x, but not actually saving the address and card.
    // OR, we can add shipping address and charged card to the schema. Maybe a receiving card for the money to be transferred to for the seller too.
    // If alive, talk to team about it tomorrow.
    // lets work with this data to compile it for order info.
    nav("/order",OrderInfo);
  }
  return (
    <div className="flex-v scroll-y">
    <div className="split-screen centered">
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
                  <p>Selected Credit Card: {formatCreditCard(creditCard)}</p>
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
                  postSuccessFunction={(obj) => {
                    setCreditCard(obj);
                  }}
                  autoFillOptionFormatter={(obj) => {
                    return { value: obj, text: formatCreditCard(obj) };
                  }}
                  autofillOptions={user ? user.credit_cards : undefined}
                />
              )}
            </Dropdown>

            <Dropdown label="Address">
              {Object.keys(address).length > 3 ? (
                <>
                  <p>Selected Address: {formatAddress(address)}</p>
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
              <button className="three-d-button" onClick={()=>{makePastTransactions()}}>Checkout</button>
            )}
          </Dropdown>
        )}
      </div>
      <Cart shopping_cart={user.shopping_cart} passUpCart={updateCheckout} />
    </div>
    </div>
  );
}
export default Checkout;
