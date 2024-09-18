import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
function Login() {
    // Login form as seen on page 2 of our mockflow
    // make get call to user with inputs from the form
    // if error is not gotten back, run login with what's received back then navigate to account
    const {token,login} = useContext(AuthContext);
    return (<div>LOGIN<form></form></div>);
}

export default Login;