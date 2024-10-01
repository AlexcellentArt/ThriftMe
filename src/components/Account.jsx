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
        setPastTransactions(user.pastTransactions);
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
          <div>
          {pastTransactions?.map((past_Transactions) => {
              return (
                <div>
                  {pastTransactions.seller}, {pastTransactions.buyer},
                </div>
              );
            })}
          </div>

        </Dropdown>
      </div>
    </div>
  );
}

export default Account;
