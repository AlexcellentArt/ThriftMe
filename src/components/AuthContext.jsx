import React, { useState, createContext } from "react";
const AuthContext = createContext("AuthContext");
export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // const cartId = 12;
  // const userId = 12;
  const [cartToken, setCartToken] = useState(null);
  const API_URL = "http://localhost:3000/api/";
  const FRONT_END_URL = "http://localhost:5173/api/";
  const local_cart={}
  function AutoHeader(){return {'Content-Type':'application/json',Authorization:"Bearer "+token,}}
  async function NotLoggedIn(){
    if (!token) {
      console.error("Not logged in");
      return true;
    }
    // const localToken = autoLogin()
    // if(localToken !== null){
    //   console.log("SETTING TOKEN")
    //   setToken(localToken)
    // }
  };
  function autoLogin(){
    console.log("SETTING TOKEN")
    const token = window.localStorage.getItem("token")
    console.log(token)
    if (token !== undefined||null){setToken(token)}
    else {console.log("No token in local storage")}
    return token
  }
  async function addToCart(item_id) {
    {
      // if (NotLoggedIn()) {
      //   return;
      // }
      const modified = modifyCart(item_id, 1);
      return modified
    }
  }
  async function removeFromCart(item_id) {
    // if (NotLoggedIn()) {
    //   return;
    // }
    const modified = modifyCart(item_id, -1);
    return modified
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
      console.log("AAAAAAaaa")
      let cart;
      // if not logged in, modify local cart
      // need to make cart take and give token, but this works for now
      // try to get from local first
      console.log("laaa")
      const local = window.localStorage.getItem("token")
      let localCartToken = window.localStorage.getItem("cart_id")
      // if (!local && !localCartToken){setCartToken(localCartToken)}
      const header = {'Content-Type':'application/json',Authorization:"Bearer "+token}
      if (token === undefined||null && localCartToken !== undefined||null){
        console.log("CART")
        if (!localCartToken){
          console.log("MAKING NEW CART")
          const res = await fetch(`http://localhost:3000/api/shopping_cart/guest`,{headers:header,body:{},method:"POST"});
          console.log(res)
          const newCart = await res.json()
          console.log(newCart)
          setCartToken(newCart.id)
          window.localStorage.setItem("cart_id",newCart.id);
          localCartToken = newCart.id
        }
      }
      const res = await fetch(`http://localhost:3000/api/shopping_cart/${localCartToken}`,{headers:header});
      cart= await res.json();
      console.log(cart)
      // modify  gotten cart
      if (res.ok) {
        // if not in dict,
        if (item_id < 1){throw new Error("Id cannot be less than 1")}
        if (!cart.item_dict[item_id]){cart.item_dict[item_id] = 0}
        const newAmount = cart.item_dict[item_id] + by;
        // check to see is 0 or negative, and if so, remove key
        if (newAmount <= 0 || cart.item_dict[item_id] == null) {
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
          const response = await fetch(`http://localhost:3000/api/shopping_cart/${localCartToken}`, {
            method: "PUT",
            headers: header,
            body: JSON.stringify(cart)
          });
          const res = await response.json();
          return res
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function clearCart() {
    // get cart
    try {
      let cart;
      // if not logged in, modify local cart
      // need to make cart take and give token, but this works for now
      // try to get from local first
      const local = window.localStorage.getItem("cart_id")
      if (local && local !== null){setCartToken(local)}
      if (!window.localStorage.token){
        if (localCartToken){
          // guest carts are deleted.
          console.log("MAKING NEW CART")
          const res = await fetch(`http://localhost:3000/api/shopping_cart/${localCartToken}`,{headers:{Authorization:`Bearer ${token}`},method:"DELETE"});
          window.localStorage.setItem("cart_id",null);
          return
        }
      }
      // user carts are cleared
      const response = await fetch(`http://localhost:3000/api/shopping_cart/${localCartToken}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },
        body: {item_dict:{},total_cost:0}
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function getUser() {
    // const local_token = overrideToken ? overrideToken:token
    try {
      if (!token){throw Error("User Not Logged In")}
      console.log("getting user with token "+token)
      // only returning l for now, assuming everyone is using it to test login
      const res = await fetch(API_URL + "user/me",{headers:{"token":token}});
      if (res.ok) {
        const json = await res.json();
        console.log(json);
        return json;
      }
    } catch (error) {
      console.error(error);
      return undefined
    }
  }
  async function addToBrowsingHistory(tags) {
    // const local_token = overrideToken ? overrideToken:token
    try {
      if (!token){throw Error("User Not Logged In")}
      console.log("getting user with token "+token)
      const user = await getUser()
      const history = user.browsing_history
      if(!history){throw Error("No History")}
      history.looked_at_tags = [...history.looked_at_tags,...tags]
      // only returning l for now, assuming everyone is using it to test login
      const res = await fetch(API_URL + "browsing_history/"+user.id,{headers:AutoHeader(),method:"PUT",body:{looked_at_tags:history}});
      if (res.ok) {
        const json = await res.json();
        console.log(json);
        return json;
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function addToBrowsingHistory(tags) {
    // const local_token = overrideToken ? overrideToken:token
    try {
      if (!token){throw Error("User Not Logged In")}
      console.log("getting user with token "+token)
      const user = await getUser()
      const history = user.browsing_history
      if(!history){throw Error("No History")}
      history.looked_at_tags = [...history.looked_at_tags,...tags]
      // only returning l for now, assuming everyone is using it to test login
      const res = await fetch(API_URL + "browsing_history/",{headers:{"token":token},body:{looked_at_tags:history}});
      if (res.ok) {
        const json = await res.json();
        console.log(json);
        return json;
      }
    } catch (error) {
      console.error(error);
    }
  }
 async function login(obj) {
    console.log("setting token:" + obj.token);
    // add in verification of user
    setToken(obj.token);
    console.log("USER IS: " + obj.user);
    console.log(obj.user)
    window.localStorage.setItem("token", obj.token);
    window.localStorage.setItem('cart_id',obj.shopping_cart.id)
    // for now, all users are admins, but this will be factored out later, as when fetching user here I can determine if they are an admin or not
    // const user = await getUser(obj.token)
    // console.log(user)
    setIsAdmin(obj.is_admin);
    setCartToken(obj.shopping_cart.id)
  }
  function logout() {
    console.log("LOGGING OUT")
    setToken(null);
    setIsAdmin(false);
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('cart_id')
  }
  async function mapItemDictToObjArray(item_dict) {
    const arr = []
    try {
      for (const id in item_dict) {
        //get item by id
        console.log(id)
        const res = await fetch(`http://localhost:3000/api/item/${id}`);
        // throw if missing
        if (!res.ok){throw Error("ITEM MISSING")}
        const item = await res.json();
        // add quantity of item in cart to obj
        item["quantity"] = item_dict[id]
        arr.push(item)
      }
    } catch (error) {
      console.error(error)
    }
    console.log(arr)
    return arr
  }
  return (
    <AuthContext.Provider
      value={{
        API_PATH: API_URL,
        token,
        isAdmin,
        cartToken,
        login,
        logout,
        NotLoggedIn,
        addToCart,
        removeFromCart,
        modifyCart,
        calculatePrice,
        getUser,
        mapItemDictToObjArray,
        AutoHeader,
        addToBrowsingHistory,
        clearCart,
        checkForLocalToken: autoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContextProvider;
export { AuthContext };
