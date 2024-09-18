import { AuthContext } from "./AuthContext";
import { useContext,useEffect } from "react";
function Register() {
    // Register form as seen on page 2 of our mockflow
    // make post call to user with inputs from the form
    // if error is not gotten back, run login with what's received back then navigate to account
    const {token,login} = useContext(AuthContext);
    return (<div>Register<form></form></div>);
}

export default Register;