import React, { useState, createContext } from "react";
const AuthContext = createContext("AuthContext");
export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const cartId = 12;
  const userId = 12
  const API_URL = "http://localhost:3000/api/";
  const FRONT_END_URL = "http://localhost:5173/api/";
  const NotLoggedIn = () => {
    if (!token) {
      console.error("Not logged in");
      return true;
    }
  };
  async function toggleFavorite(item_id) {
    if (NotLoggedIn()) {
      return;
    }
  }
  async function addToCart(item_id) {
    {
      // if (NotLoggedIn()) {
      //   return;
      // }
      modifyCart(item_id, 1);
    }
  }
  async function removeFromCart(item_id) {
    if (NotLoggedIn()) {
      return;
    }
    modifyCart(item_id, -1);
  }

  async function calculatePrice(item_dict) {
    let price = 0
    try {
      for (const id in item_dict) {
        //get item by id
        const res = await fetch(`http://localhost:3000/api/item/${id}`);
        // throw if missing
        if (!res.ok){throw Error("ITEM MISSING")}
        const item = await res.json();
        // multiplying price times the amount
        price += (item.price*item_dict[id])
      }
    } catch (error) {
      console.error(error)
    }
    console.log("Price of cart is now "+price)
    return price
  }
  // if you modify cart directly, for removing numbers, use negatives!
  async function modifyCart(item_id, by) {
    // get cart
    try {
      // if ()
      const res = await fetch(`http://localhost:3000/api/shopping_cart/${userId}/${cartId}`);
      const cart = await res.json();
      // modify gotten cart
      if (res.ok) {
        console.log(cart);
        // if not in dict,
        if (!cart.item_dict[item_id]){cart.item_dict[item_id] = 0}
        const newAmount = cart.item_dict[item_id] + by;
        // check to see is 0 or negative, and if so, remove key
        if (newAmount <= 0) {
          delete cart.item_dict[item_id];
        }
        // else set it
        else {
          cart.item_dict[item_id] = newAmount;
        }
        // calc new price
        cart.total_cost = await calculatePrice(cart.item_dict)
        console.log(cart)
        try {
          const response = await fetch(`http://localhost:3000/api/shopping_cart/${cartId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cart),
          });
          const res = await response.json();
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function getUser(id) {
    try {
      // only returning l for now, assuming everyone is using it to test login
      const res = await fetch(API_URL + "user/"+id);
      if (res.ok) {
        const json = await res.json();
        console.log(json);
        return json;
      }
    } catch (error) {
      console.error(res);
    }
  }
  function login(obj) {
    console.log("setting token:" + obj.token);
    // add in verification of user
    setToken(obj.token);
    console.log("USER IS: " + obj.user);
    window.localStorage.setItem("token", obj.token);
    // for now, all users are admins, but this will be factored out later, as when fetching user here I can determine if they are an admin or not
    setIsAdmin(true);
  }
  function logout() {
    setToken(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        API_PATH: API_URL,
        token,
        isAdmin,
        login,
        logout,
        toggleFavorite,
        addToCart,
        removeFromCart,
        modifyCart,
        calculatePrice,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContextProvider;
export { AuthContext };
