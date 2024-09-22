import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
import Cart from "./Cart";
import OrderConfirmation from "./OrderConfirmation";
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
function Checkout() {
    const {token} = useContext(AuthContext);
    // see if I can't fix this to use form generator
    const stripe = useStripe();
    const elements = useElements();
    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);
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
        if (result.error) {
          console.log(result.error);
        }
      };
    return (<div><div>CHECKOUT</div><Cart/></div>);
}

export default Checkout;