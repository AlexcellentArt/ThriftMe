import { AuthContext } from "./AuthContext";
import { useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormGenerator from "./FormGenerator";
function Register() {
    // Register form as seen on page 2 of our mockflow
    // make post call to user with inputs from the form
    // if error is not gotten back, run login with what's received back then navigate to account
    const fields = [{key:"name",type:"text"},{key:"email",type:"email"},{key:"password",type:"text"}]
    const {login} = useContext(AuthContext);
    const navigate = useNavigate()
    function goToAccount(obj){
        login(obj.token)
        navigate("/account")
    }
    return (<FormGenerator labelAdditionalClasses="formLabel" fields ={fields} apiPath="user" method="GET" postSuccessFunction={(obj)=>{goToAccount(obj)}}/>);
}

export default Register;