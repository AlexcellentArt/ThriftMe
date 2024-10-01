import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState } from "react";
import DisplayMany from "./DisplayMany";
import { useEffect } from "react";
import React from "react";
import FormGenerator from "./FormGenerator";
// import { past_Transactions, shopping_Cart } from "../../prisma";
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
  const { token, getUser } = useContext(AuthContext);
  const [pastTransactions, setPastTransactions] = useState();
  const [creditCard, setCreditCard] = useState();
  const [address, setAddress] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState(false);
  console.log(pastTransactions);
  console.log(user);

  useEffect(() => {
    const getMe = async () => {
      try {
        const user = await getUser();
        console.log(user);
        const addressFields = [
          { key: "zip", type: "number" },
          { key: "street", type: "text" },
          { key: "apartment", type: "text" },
          { key: "hi ", type: "text", default: "aaggggggggggggg" },
          { key: "sujoy", type: "text", default: "aaaa" },
          { key: "hiii alexis", type: "text", default: "uwuwuuwuwuuw" },
        ];
        const creditCardFields = [
          { key: "pin", type: "number" },
          { key: "exp_date", type: "month" },
          { key: "cvc", type: "number" },
        ];
        setAddress(user.addresses);
        setEmail(user.email);
        setCreditCard(user.creditCard);
        setPastTransactions([ 
          user.past_transactions_seller,
          user.past_transactions_buyer,
        ]);
        const user_credit_card = user.creditCard;
        const past_transactions = [
          user.past_transactions_seller,
          user.past_transactions_buyer,
        ];
      } catch (error) {
        console.log(
          "Did not render on screen, something wrong with accounts page",
          error
        );
      }
    };

    getMe();
  }, []);
  console.log(address);
  function stylePastTransactions(obj){
    pastTransactions.map(obj)=>({

    
    // example of the data structure you will get in
    // 0 : {"id":15,"seller_id":25,"buyer_id":12,"shipping_address":"Domino Gully null Pelican Hamlet 24754","paying_card":"$2b$13$dNHp8Kj2BwQXlWlImWd7TOW4OEPujr8CDoorMoRIbN6oPq6lpAhqS 05/08","item_dict":{"65":7,"66":8},"total_cost":2178,"tags":["skirt","green","cotton","small","refined","dress shirt","ivory","velvet","sleek"]}
    
    return (
    
        <p>{seller_id}</p>,
        <p>{buyer_id}</p>,
        <p>{shipping_address}</p>,
        <p>{paying_card}</p>,
        <p>{item_dict}</p>
      
      /* Insert your p's here and stuff */
      );
  )
  }
  return (
    <div className="">
      <div className="">
        <Dropdown label="Credit Card"></Dropdown>
        <div>{creditCard}</div>
        <Dropdown label="Email">
          <div>{email}</div>
        </Dropdown>
        <Dropdown label="Address">
          <div>
            {address?.map((address) => {
              return (
                <div>
                  {address.apartment}, {address.street}, {address.state},{" "}
                  {address.city}, {address.zip},
                </div>
              );
            })}
          </div>
        </Dropdown>

        <Dropdown label="Past Transactions">
          {console.log("pastTransactions")};
          {/* add in to display many's props this when your factory is ready: factory ={stylePastTransactions} */}
          <DisplayMany data={pastTransactions}/>

        </Dropdown>
      </div>
    </div>
  );
}

export default Account;