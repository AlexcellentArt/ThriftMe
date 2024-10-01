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
import UserDashboard from "./UserDashboard";
import Products from "./Products";


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
  const { token, getUser, mapItemDictToObjArray } = useContext(AuthContext);
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
        setAddress(user.addresses);
        setEmail(user.email);
        setCreditCard(user.creditCard);
        const compiled = [
          ...user.past_transactions_seller,
          ...user.past_transactions_buyer,
        ];
        console.log(compiled);
        // compiled
        for (let index = 0; index < compiled.length; index++) {
          const element = compiled[index];
          const mapped = await mapItemDictToObjArray(element.item_dict);
          compiled[index]["mapped"] = mapped;
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
  function stylePastTransactions(obj) {
    return (
      <div className="desc-box rounded-corners  flex-v  flex">
        <div className="flex dark-bg rounded-corners">
          <div className="white-bg rounded-corners">
          <p className="merriweather-regular left-text"><span className="merriweather-bold left-text">Seller:</span>{obj.seller_id}</p>
        <p className="merriweather-regular left-text"><span className="merriweather-bold">Shipping Address:</span>{obj.shipping_address}</p>
        <p className="merriweather-regular left-text"><span className="merriweather-bold">Paying Card:</span>{obj.paying_card}</p>
          </div>
        </div>
        <div className="scroll-x"><Products data={obj.mapped} /></div>
      </div>
    );
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
          <DisplayMany
            data={pastTransactions}
            factory={stylePastTransactions}
            additionalClasses={"scroll-y"}
          />
        </Dropdown>
        <Dropdown label="Edit Shop">
          <UserDashboard />
        </Dropdown>
      </div>
    </div>
  );
}

export default Account;
