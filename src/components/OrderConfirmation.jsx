import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
function OrderConfirmation() {
    const {token} = useContext(AuthContext);
    return (<div>Insert all information related to the order here so the user can confirm it all looks good</div>);
}

export default OrderConfirmation;