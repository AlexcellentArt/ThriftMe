import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
import FormGenerator from "./FormGenerator";
function Login() {
    // Login form as seen on page 2 of our mockflow
    // make get call to user with inputs from the form
    // if error is not gotten back, run login with what's received back then navigate to account
    const fields = [{key:"name",type:"text"},{key:"email",type:"email"},{key:"password",type:"text"}]
    const {login} = useContext(AuthContext);
    return (<div>LOGIN<FormGenerator labelAdditionalClasses="genericShineBG" fields ={fields} apiPath="user" postSuccessFunction={(obj)=>{login(obj)}}/></div>);
}

export default Login;