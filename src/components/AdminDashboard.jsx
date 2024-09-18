import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext,useState } from "react";
import DisplayMany from "./DisplayMany";
function AdminDashboard() {
    const {token, isAdmin} = useContext(AuthContext);
    const navigate = useNavigate();
    // if isAdmin == false, user should be forcibly navigated away from the page
    // using the buttons, set in a state if the dashboard should display users or items. swap the data and/or function being fed into display many accordingly.
    // when an card in display many is hovered over, an Edit button should appear. The hover part will be handled in css by Alex, for now, just make sure one is made in the factory function.
    // Clicking on that edit button should bring up a popup menu of actions
    return (<div>ADMIN DASHBOARD<button>User</button><button>Products</button><DisplayMany/></div>);
}

export default AdminDashboard;