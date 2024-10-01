import { AuthContext } from "./AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormGenerator from "./FormGenerator";

function Register({ stayOnPage = false }) {
  const fields = [
    { key: "name", type: "text" },
    { key: "email", type: "email" },
    { key: "password", type: "text" },
  ];
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  function goToAccount(obj) {
    console.log("TOKEN:" + obj.token);
    if (!obj.token) {
      console.error("NO TOKEN");
      return;
    }
    login(obj);
    if (stayOnPage == true) {
      return;
    } else {
      navigate("/account");
    }
  }

  return (
    <div className="light-bg flex-v centered">
      <h1 className="merriweather-bold little-margin">Register</h1>
      <FormGenerator
        labelAdditionalClasses="formLabel"
        fields={fields}
        apiPath="user/register"
        method="POST"
        postSuccessFunction={(obj) => {
          goToAccount(obj);
        }}
      />
    </div>
  );
}

export default Register;
