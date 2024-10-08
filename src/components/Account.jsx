import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState } from "react";
import DisplayMany from "./DisplayMany";
import { useEffect } from "react";
import React from "react";
import FormGenerator from "./FormGenerator";
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
  const [creditCard, setCreditCard] = useState([{}]);
  const [address, setAddress] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState(false);
  useEffect(() => {
    const getMe = async () => {
      try {
        const user = await getUser();
        setAddress(user.addresses);
        setEmail(user.email);
        setCreditCard(user.credit_cards);
        const compiled = [
          ...user.past_transactions_seller,
          ...user.past_transactions_buyer,
        ];
        // compiled
        for (let index = 0; index < compiled.length; index++) {
          const element = compiled[index];
          const mapped = await mapItemDictToObjArray(element.item_dict);
          compiled[index]["mapped"] = mapped;
        }
        setPastTransactions(compiled);
        setUser(user);
      } catch (error) {
      }
    };

    getMe();
  }, [token]);
  function stylePastTransactions(obj) {
    return (
      <div className="desc-box rounded-corners  flex-v  flex">
        <div className="flex dark-bg rounded-corners">
          <div className="white-bg rounded-corners flex-v">
            <p className="merriweather-regular left-text">
              <span className="merriweather-bold left-text">Seller:</span>
              {obj.seller_id}
            </p>
            <p className="merriweather-regular left-text">
              <span className="merriweather-bold">Shipping Address:</span>
              {obj.shipping_address}
            </p>
            <p className="merriweather-regular left-text">
              <span className="merriweather-bold">Paying Card:</span>
              {obj.paying_card}
            </p>
          </div>
        </div>
        <div className="scroll-x">
          <Products data={obj.mapped} />
        </div>
      </div>
    );
  }
  function creditCardFactory(obj) {
    return (
      <div className="info">
        <p className="line-breaks">
          <span className="merriweather-bold ">Pin:</span> {obj.pin}
        </p>
        <p>
          <span className="merriweather-bold">Expiration Date:</span>
          {obj.exp_date}
        </p>
      </div>
    );
  }
  function formatAddress(obj) {
    return (
      obj.street +
      ` ${obj.apartment !== null ? obj.apartment : ""} ` +
      obj.city +
      ` ${obj.zip}`
    );
  }
  return (
    <div className="account scroll-y flex-v">
      {user ? (
        <div className="centered">
          <Dropdown label="Credit Cards">
            <DisplayMany data={creditCard} factory={creditCardFactory} />
          </Dropdown>
          <Dropdown label="General Information">
            {user && (
              <div className="info">
                <hr />

                <h3 className=" ">Login</h3>
                <hr />

                <p>
                  <span className="merriweather-bold">Name:</span>
                  {user.name}
                </p>
                <p>
                  <span className="merriweather-bold">Email:</span>
                  {email}
                </p>
                <hr />

                <h3 className="line-breaks">Stats</h3>
                <hr />
                <p>
                  <span className="merriweather-bold">
                    Total Items In Shop:
                  </span>
                  {user.items.length}
                </p>
                <p>
                  <span className="merriweather-bold">
                    Total Past Transactions:
                  </span>
                  {pastTransactions.length}
                </p>
                <p>
                  <span className="merriweather-bold">Total Addresses:</span>
                  {address.length}
                </p>
                <p>
                  <span className="merriweather-bold">Total Credit Cards:</span>
                  {creditCard.length}
                </p>
              </div>
            )}
          </Dropdown>
          <Dropdown label="Addresses">
            <div className="info">
              {address?.map((address) => {
                return (
                  <div className="line-breaks">
                    <p>{formatAddress(address)}</p>
                  </div>
                );
              })}
            </div>
          </Dropdown>
          <Dropdown label="Past Transactions">
            <DisplayMany
              data={pastTransactions}
              factory={stylePastTransactions}
              additionalClasses={"info"}
            />
          </Dropdown>
          <Dropdown label="Edit Shop">
            <UserDashboard />
          </Dropdown>
        </div>
      ) : (
        <div>
          <p className="merriweather-black-italic">
            Loading User Information...
          </p>
        </div>
      )}
    </div>
  );
}

export default Account;
