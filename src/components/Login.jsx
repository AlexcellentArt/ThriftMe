import { AuthContext } from "./AuthContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormGenerator from "./FormGenerator";

function Login({ stayOnPage = false }) {
  // make get call to user with inputs from the form
  // if error is not gotten back, run login with what's received back then navigate to account
  const nav = useNavigate();
  const fields = [
    { key: "email", type: "email" },
    { key: "password", type: "password" },
  ];
  function goToProducts(obj) {
    if (!obj.token) {
      return;
    }
    login(obj);
    if (stayOnPage == true) {
      return;
    }
    if (obj.is_admin === true) {
      nav("/admin");
    } else {
      nav("/account");
    }
  }
  const { login } = useContext(AuthContext);
  return (
    <div className="light-bg flex-v width-scale centered">
      <h1 className="merriweather-bold little-margin">Login</h1>
      <FormGenerator
        labelAdditionalClasses=""
        fields={fields}
        apiPath="user/login"
        postSuccessFunction={(obj) => {
          login(obj);
          goToProducts(obj);
        }}
      />
    </div>
  );
}

export default Login;
