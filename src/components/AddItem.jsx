import { AuthContext } from "./AuthContext";
import { useContext,useEffect } from "react";
function AddItem() {
    // Add Item form as seen on page 3 of our mockflow
    // get values from form, then send in post fetch to items. If no error is received back, then return to previous page.
    const {token} = useContext(AuthContext);
    return (<div>Add Item<form></form></div>);
}

export default AddItem;