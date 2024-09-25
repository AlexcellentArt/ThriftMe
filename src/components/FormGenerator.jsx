import React, { useState, useReducer } from "react";
function FormGenerator({
  fields,
  fetchFunctionOverride,
  postSuccessFunction = null,
  apiPath = "user",
  labelAdditionalClasses = "",
  fetch_method = "POST",
  additionalDataToSend
}) {
  // Authorization: `Bearer ${token}`
  function commaSplitEndWithAnd(arr) {
    if (arr.length === 2) {
      return `${arr[0]} and ${arr[1]}`;
    }
    const last = arr.pop();
    let newStr = arr.join(", ");
    return newStr + ", and " + last;
  }
  async function defaultFetch(url, obj, setError = null) {
    const API_URL = `http://localhost:3000/api/${url}`;
    try {
      console.log(API_URL);
      console.log(obj);
      //verify path exists
      console.log("AAAAAAAAAA");
      // const exists = await fetch(API_URL,
      //   { method: "HEAD",        headers: {
      //     "Content-Type": "application/json",
      //   }, })
      //   if (!exists.ok){const mes = await exists.json(); throw new Error(mes)}
      if (additionalDataToSend){obj = {obj,...additionalDataToSend}}
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const res = await response.json();
      if (!response.ok) {
        if (setError !== null) {
          setError(res.message);
        }
        throw new Error(res.message);
      }
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  {
    const [formData, dispatch] = useReducer(
      formDataReducer,
      createInitialValues()
    );
    const [error, setError] = useState();
    const [isFirstTry, setIsFirstTry] = useState(true);
    function createInitialValues(initialValue = "") {
      const obj = {};
      fields.forEach((field) => {
        obj[field.key] = {
          type: field.type,
          value: initialValue,
          isValid: false,
          name: field.key,
        };
        if ("label" in field) {
          obj["label"] = field.label;
        }
        if ("options" in field) {
          obj["options"] = field.options;
        }
      });
      return obj;
    }

    async function handleUpdateFormData(type, key, value = "") {
      // if input type is one that works with strings, trim the value
      if ((type = "text" || "email")) {
        value = value.trim();
      }
      const valid = await verifyInput(type, value);
      await dispatch({
        type: "update",
        input: {
          key: key,
          isValid: valid,
          value: value,
        },
      });
    }
    async function handleResetFormData() {
      await dispatch({
        type: "reset",
      });
    }
    function formDataReducer(data, action) {
      switch (action.type) {
        case "update": {
          data[action.input.key].isValid = action.input.isValid;
          data[action.input.key].value = action.input.value;
          return data;
        }
        case "reset": {
          Object.keys(data).forEach((key) => {
            data[key].isValid = false;
            data[key].value = "";
          });
          return data;
        }
        default: {
          throw Error("Unknown action: " + action.type);
        }
      }
    }
    function compileFormData() {
      const obj = {};
      Object.entries(formData).forEach((data) => {
        obj[data[0]] = data[1].value;
      });
      return obj;
    }
    async function handleSubmit(e) {
      e.preventDefault();
      const allValid = await validateForm();
      if (!allValid) {
        return;
      }
      let res;
      const compiled = compileFormData()
      // if not making a call to an api path, which is assumed by the lack of it, then the compiled data is set as the result and passed straight to the on success function if set
      if (apiPath) {
        try {
          res = await defaultFetch(apiPath, compiled, setError);
          if (res === null) {
            return;
          }
        } catch (error) {
          console.error(error);
          setError(error);
        }
      }
      else{res = compiled}
      if (isFirstTry === true) {
        setIsFirstTry(false);
      }
      if (postSuccessFunction !== null) {
        postSuccessFunction(res);
      }
      setIsFirstTry(true);
      Object.values(e.target.children[0].children).forEach(
        (c) => (c.children[0].value = "")
      );
      await handleResetFormData();
    }
    async function validateForm() {
      let allDataValid = true;
      const invalidFields = [];
      Object.values(formData).forEach((obj) => {
        if (obj.isValid === false) {
          allDataValid = false;
          console.log(obj);
          invalidFields.push(obj.name);
        }
      });
      try {
        if (!allDataValid) {
          throw Error(
            allDataValid.length > 1
              ? ` ${commaSplitEndWithAnd(invalidFields)} are invalid`
              : `${invalidFields[0]} is invalid.`
          );
        }
        return true;
      } catch (error) {
        setError(error.message);
        return false;
      }
    }
    async function verifyInput(key, inputVal) {
      let res = false;
      switch (key) {
        case "email":
        case "text":
          if (inputVal.split().length > 0) {
            res = true;
          }
          break;
        default:
          res = true;
          break;
      }
      return res;
    }
    function createInputClassName(base = "", key) {
      if (isFirstTry || !formData[key].isValid === true) {
        return `${base} ${labelAdditionalClasses}`;
      } else {
        return `${base} ${labelAdditionalClasses} invalid`;
      }
    }
    function makeLabel(key, content) {
      return (
        <label
          className={createInputClassName(formData[key].type, key)}
          key={key}
          id={key}
          htmlFor={key}
        >
          {`${"label" in formData[key] ? formData[key].label : key}:`}
          {content}
        </label>
      );
    }
    function makeInput(key) {
      return (
        <input
          type={formData[key].type}
          name={key}
          id={key}
          onChange={(e) =>
            handleUpdateFormData(e.target.type, key, e.target.value)
          }
        />
      );
    }
    function makeSelect(key) {
      // make options out of keys
      return (
        <select
          name={key}
          key={key}
          id={key}
          onChange={(e) =>
            handleUpdateFormData(e.target.type, key, e.target.value)
          }
        >
          {makeOptions(formData[key].options)}
        </select>
      );
    }

    function makeOptions(options) {
      if (Array.isArray(options) === true) {
        return options.map((option) => {
          return <option value={option}>{option}</option>;
        });
      } else {
        return Object.keys(options).map((key) => {
          return <option value={key}>{options[key]}</option>;
        });
      }
    }
    function buildInputs(inputKey) {
      //DOCUMENTATION: based on type, content is generated and setup according to what's at the key in formData. Label is setup the same way, with content being placed inside it.
      let content;
      if (formData[inputKey].type === "select") {
        return makeSelect(inputKey);
      } else {
        content = makeInput(inputKey);
      }
      return makeLabel(inputKey, content);
    }
    return (
      <form key="form" id="form" onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <div className={`formInputs`}>
          {Object.keys(formData).map((key) => buildInputs(key))}
        </div>
        <button className="big-text" type="submit">
          Submit
        </button>
      </form>
    );
  }
}

export default FormGenerator;
