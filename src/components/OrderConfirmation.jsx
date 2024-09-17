import { TokenContext } from "./TokenContext";
import { useContext,useState} from "react";
function OrderConfirmation() {
    const {token, setToken} = useContext(TokenContext);
    return (<div>TBM</div>);
}

export default OrderConfirmation;