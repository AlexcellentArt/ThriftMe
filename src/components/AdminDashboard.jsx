import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext,useState } from "react";
function AdminDashboard() {
    const {token, isAdmin} = useContext(AuthContext);
    const navigate = useNavigate();
    return (<div>ADMIN DASHBOARD</div>);
}

export default AdminDashboard;