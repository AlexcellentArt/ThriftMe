import { TokenContext } from "./TokenContext";
import { useContext,useState} from "react";

function Checkout() {
    const {token, setToken} = useContext(TokenContext);
    return (<div>TBM</div>);
}

export default Checkout;