import { AuthContext } from "./AuthContext";
import { useContext,useState} from "react";
import FormGenerator from "./FormGenerator";
function Login() {
    // Login form as seen on page 2 of our mockflow
    // make get call to user with inputs from the form
    // if error is not gotten back, run login with what's received back then navigate to account
    const fields = [{key:"email",type:"email"},{key:"password",type:"text"}]
    const {login} = useContext(AuthContext);
    return (<div>LOGIN<FormGenerator labelAdditionalClasses="" fields ={fields} apiPath="user/login" postSuccessFunction={(obj)=>{console.log("token "+obj.token);console.log(obj);login(obj)}}/></div>);
}

export default Login;