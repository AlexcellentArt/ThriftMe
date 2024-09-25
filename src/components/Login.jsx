import { AuthContext } from "./AuthContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormGenerator from "./FormGenerator";
function Login() {
  // Login form as seen on page 2 of our mockflow
  // make get call to user with inputs from the form
  // if error is not gotten back, run login with what's received back then navigate to account
  const fields = [
    { key: "email", type: "email" },
    { key: "password", type: "text" },
  ];
  function goToProducts(obj) {
    console.log("TOKEN:" + obj.token);
    if (!obj.token) {
      console.error("NO TOKEN");
      return;
    }
    login(obj);
    navigate("/products");
  }
  const { login } = useContext(AuthContext);
  return (
    <div className="light-bg flex-v force-fill-main">
      <nav className="move-up">
        <ul className="flex-h">
          <li className="navLinks nav-tabs">
            <Link to="/login">Login</Link>
          </li>
          <li className="navLinks nav-tabs">
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <h1 className="merriweather-bold little-margin">Login</h1>
      <FormGenerator
        labelAdditionalClasses=""
        fields={fields}
        apiPath="user/login"
        postSuccessFunction={(obj) => {
          console.log("token " + obj.token);
          console.log(obj);
          login(obj);
          goToProducts(obj)
        }}
      />
    </div>
  );
}

export default Login;
