import { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
require("dotenv").config();

function Cart() {
  const cart = useSelector((state) => state.AddToCart);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  //   useEffect(() =>{})

  //    function NetTotal(){}

  //   function totalCartNumber(){}

  const makePayment = async () => {
    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

    const body = {
      products: cart,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${apiURL}/create-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const session = await response.json();

    const result = stripe.redirectToCheckout({ sessionId: session.id });
  };

  return <div>CART</div>;
}

export default Cart;
