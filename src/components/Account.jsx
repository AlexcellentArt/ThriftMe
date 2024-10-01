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
  const { token, getUser,mapItemDictToObjArray } = useContext(AuthContext);
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
        const compiled =  [ 
          ...user.past_transactions_seller,
          ...user.past_transactions_buyer,
        ]
        // compiled
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          const mapped = await mapItemDictToObjArray()
        }
        const user_credit_card = user.creditCard;
        setPastTransactions(compiled);
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
    <p>{obj.seller_id}</p>,
    <p>{obj.buyer_id}</p>,
    <p>{obj.shipping_address}</p>,
    <p>{obj.paying_card}</p>,
    <p>{obj.item_dict}</p>
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