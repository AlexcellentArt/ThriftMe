import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
import Cart from "./Cart";
import OrderConfirmation from "./OrderConfirmation";
function Checkout() {
    const {token} = useContext(AuthContext);
    return (<div><div>CHECKOUT</div><Cart/></div>);
}

export default Checkout;