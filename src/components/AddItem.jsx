import { AuthContext } from "./AuthContext";
import { useContext,useEffect } from "react";
function AddItem() {
    // Add Item form as seen on page 3 of our mockflow
    const {token} = useContext(AuthContext);
    return (<div>Add Item<form></form></div>);
}

export default AddItem;