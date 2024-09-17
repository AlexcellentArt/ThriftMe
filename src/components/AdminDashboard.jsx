import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import { useContext } from "react";
function AdminDashboard() {
    const {token, setToken} = useContext(TokenContext);
    const navigate = useNavigate();
    return (<div>TBM</div>);
}

export default AdminDashboard;