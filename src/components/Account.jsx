import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext,useState } from "react";
import DisplayMany from "./DisplayMany";
import { useEffect } from "react";
import React from "react";
import FormGenerator from "./FormGenerator";
import { past_Transactions, shopping_Cart } from "../../prisma";
import Dropdown from "./Dropdown";
import Cart from "./Cart";
/**
 * I need to have multiple buttons that will lead to the:
 * Summary,
 * Personal Info,
 * Shop,
 * History,
 * Credit Cards,
 *  Addresses,
 * Settings
 * API calls should be user ID specific so only the client can see the actual information
 * So the API call should be for the database specific to them
 *
 * Use effect can be used to pull for these.
 * If the user is able to see their account they would have been able to only their own information on the page
 *
 * Get user
 * offcontext
 * I want to click a button and have the information for that page show up.
 */
function Account() {
    const {token, getUser}= useContext{AuthContext};
    const {pastTransactions, setPastTransactions}= useState();
    const {credit_card, setcredit_Card}= useState();
    const {address, setAddresses}= useState();
    const [user, setUser] = useState(false);

    useEffect(()=>{
        const getMe= async ()=> {
            const user= await getUser();
            console.log(user);
            const addressFields = [
                { key: "zip", type: "number" },
                { key: "street", type: "text" },
                { key: "apartment", type: "text" },
                { key: "hi ", type: "text", default:"aaggggggggggggg"  },
                { key: "sujoy", type: "text", default:"aaaa" },
                { key: "hiii alexis", type: "text", default:"uwuwuuwuwuuw" }
              ];
              const creditCardFields = [
                { key: "pin", type: "number" },
                { key: "exp_date", type: "month" },
                { key: "cvc", type: "number" },
              ];
            const user_shopping_cart= user.shopping_Cart;
            const user_addresses= user.address;
            const user_credit_card=user.creditCard;
            const past_transactions= {
                [user.past_transactions_seller,
                user.past_transactions_buyer]
            }

            getMe());}


  

        : ;




<div className="split-screen fill-screen flex-h">
<div className="checkout">
  <Dropdown label="Credit Card">
    <FormGenerator
      fields={creditCardFields}
      data={creditCardFields.map(({key,value}))=> ({[key]:value});
    }
      postSuccessFunction={(obj) => {
        setAddress(obj);
      }}
    />
  </Dropdown>
  <Dropdown label="Address">
    <FormGenerator
      fields={addressFields}
      data={addressFields.map(({key,type}))=> ({[key]:value});
    }
      postSuccessFunction={(obj) => {
        setCreditCard(obj);
      }}
    />
  </Dropdown>

  <Dropdown label="Summary">
    <DisplayMany
      data={past_Transactions.map(({key,value}))=> ({[key]:value});
      }
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
    





