import { TokenContext } from "./TokenContext";
import { useContext } from "react";
function Register() {
    const {token, setToken} = useContext(TokenContext);
    return (<div>TBM</div>);
}

export default Register;