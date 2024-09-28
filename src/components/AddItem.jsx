import { AuthContext } from "./AuthContext";
import { useContext,useEffect } from "react";
import FormGenerator from "./FormGenerator";
function AddItem() {
    // Add Item form as seen on page 3 of our mockflow
    // get values from form, then send in post fetch to items. If no error is received back, then return to previous page.
    const {token} = useContext(AuthContext);
    const fields = [
        { key: "name", type: "text" },
        { key: "price", type: "number"},
        { key: "tags", type: "text" },
        // { key: "description", type: "textarea" },
        // { key: "photos", type: "multiple files" },
      ];
    return (<div>Add Item <FormGenerator fields={fields}/></div>);
}

export default AddItem;