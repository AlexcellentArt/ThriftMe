import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
function Login() {
    const {token,login} = useContext(AuthContext);
    return (<div>LOGIN</div>);
}

export default Login;