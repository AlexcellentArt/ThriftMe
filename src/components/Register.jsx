import { AuthContext } from "./AuthContext";
import { useContext } from "react";
function Register() {
    const {token} = useContext(AuthContext);
    return (<div>Register</div>);
}

export default Register;