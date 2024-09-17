import { TokenContext } from "./TokenContext";
import { useContext,useState} from "react";
function Login() {
    const {token, setToken} = useContext(TokenContext);
    return (<div>TBM</div>);
}

export default Login;