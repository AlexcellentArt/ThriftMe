import React, { useState, useReducer, useEffect } from "react";
import SelectionGenerator from "./SelectionGenerator";
import { da } from "@faker-js/faker";
function FormGenerator({
  fields,
  // canAutoFill = false,
  // autofill = [],
  autofillOptions,
  autoFillOptionFormatter,
  fetchFunctionOverride,
  postSuccessFunction = null,
  apiPath = "user",
  labelAdditionalClasses = "",
  fetch_method = "POST",
  additionalDataToSend,
}) {
  useEffect(() => {
    console.log("Form Generator Reloading Fields");
    // make dispatch here to autofill
    // autoFill(autofill);
  }, [fields]);
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
      // const exists = await fetch(API_URL,
      //   { method: "HEAD",        headers: {
      //     "Content-Type": "application/json",
      //   }, })
      //   if (!exists.ok){const mes = await exists.json(); throw new Error(mes)}
      if (additionalDataToSend) {
        obj = { obj, ...additionalDataToSend };
      }
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
  const [autoFillData, autoFillDispatch] = useReducer(
    autoFillDataReducer,
    createAutoFillOptions()
  );
  function createAutoFillOptions(){
    if(!autofillOptions){ console.log("NO AUTOFILL OPTIONS");return {}}
    console.log("AUTOFILL OPTIONS FOUND:",JSON.stringify(autofillOptions))
    // New will always be 0 by default
try {
      const options = [{value:"New",text:"New"}]
      autofillOptions.forEach((op,idx) => {
        const id = idx+1
        // options[id]={value: op, text: op.option_label?op.option_label:JSON.stringify(op)};
        options.push({value: op, text: op.option_label?op.option_label:JSON.stringify(op)})
      })
      console.log(options)
      return options
} catch (error) {
 console.error("ERROR PROCESSING AUTOFILL DATA: ",error) 
}
    // options.push({value:"New"})
    return {}
  }
  function autoFillDataReducer(data, action) {
    switch (action.type) {
      case "reload": {
        data = createAutoFillOptions()
        return data;
      }
      case "store new": {
        // stores the new data so it's not lost
        data["new"] = action.data
        return data;
      }
      case "autofill": {
        console.log(data)
        const objKeys = Object.keys(autofillOptions);
        // don't autofill if nothing to do so
        if (objKeys.length <= 0) {
          return;
        }
        objKeys.forEach((key)=>{
          data[key]
        })
        const filled = fields.map((field) => {
          const fill = {};
          // see if object has key matching field
          console.log(objKeys.includes(field.key));
          let val;
          if (objKeys.includes(field.key)) {
            // if so, add default to the field and set it equal to the object's value
            // key["default"] = obj[key.key];
            val = obj[field.key];
          } else {
            val = field.value;
          }
          fill[key] = val;
          return fill;
        });
        console.log(filled);
        handleUpdateFormData()
        return data;
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  }
  const [formData, dispatch] = useReducer(
    formDataReducer,
    createInitialValues()
  );
  const [error, setError] = useState();
  const [isFirstTry, setIsFirstTry] = useState(true);
  // const [isFirstTry, setIsFirstTry] = useState(true);
  // function createAutoFillValues(){
  //   {user.addresses.map((o, idx) => {
  //     return { value: idx, text: JSON.stringify(o) };
  //   })}
  // }
  function createInitialValues(initialValue = "") {
    const obj = {};
    console.log(fields);
    fields.forEach((field) => {
      // console.log(field.key + " default is " + field.default);
      obj[field.key] = {
        type: field.type,
        value: initialValue,
        isValid: false,
        name: field.key,
        default: field.default ? field.default : "",
      };
      if ("label" in field) {
        obj["label"] = field.label;
      }
      if ("options" in field) {
        obj["options"] = field.options;
      }
      // if ("default" in field) {
      //   obj["default"] = field.default;
      // }
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
      // case "autofill": {
      //   Object.keys(action.filled).forEach((key) => {
      //     data[key].isValid = true;
      //     data[key].value = action.filled[key];
      //     data[key].default = action.filled[key];
      //   });
      //   return data;
      // }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  }
  async function autoFill(obj) {
    const objKeys = Object.keys(obj);
    // don't autofill if nothing to do so
    if (objKeys.length <= 0) {
      return;
    }
    const filled = fields.map((field) => {
      const fill = {};
      // see if object has key matching field
      console.log(objKeys.includes(field.key));
      let val;
      if (objKeys.includes(field.key)) {
        // if so, add default to the field and set it equal to the object's value
        // key["default"] = obj[key.key];
        val = obj[field.key];
      } else {
        val = field.value;
      }
      fill[key] = val;
      return fill;
    });
    console.log(filled);
    dispatch({
      type: "autofill",
      fields: filled,
    });
    return filled;
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
    const compiled = compileFormData();
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
    } else {
      res = compiled;
    }
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
        className={
          "merriweather-bold " + createInputClassName(formData[key].type, key)
        }
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
    // console.log(formData[key])
    return (
      <input
        className="merriweather-regular"
        type={formData[key].type}
        name={key}
        id={key}
        onChange={(e) =>
          handleUpdateFormData(e.target.type, key, e.target.value)
        }
        defaultValue={formData[key].default}
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
    console.log(options)
try {
      if (Array.isArray(options) === true) {
        return options.map((option) => {
          return <option value={option}>{option}</option>;
        });
      } else {
        return Object.keys(options).map((key) => {
          return <option value={key}>{options[key]}</option>;
        });
      }
} catch (error) {
  console.error(error)
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
  function processOptions(options){
      try {
        if (autoFillOptionFormatter){return autoFillOptionFormatter(options)}
            // options.map((obj) => {
            //   return { value: obj, text: autoFillOptionFormatter?autoFillOptionFormatter(obj):JSON.stringify(obj)}})
      } catch (error) {
        console.error(error)
      }
    }
  return (
    <>
    {console.log(autoFillData)}
      {autofillOptions && (
        <SelectionGenerator
          label={"aaa"}
          // if there is a formatter, run the options through that as th
          options={autoFillOptionFormatter? autoFillOptionFormatter(autoFillData):autoFillData}
          // handleChange={(obj) => {
          //   autoFill(obj)
          // }}
        />
      )}
      <form
        className="generated-form"
        key="form"
        id="form"
        onSubmit={handleSubmit}
      >
        {error && <p>{error}</p>}
        <div className={`form-inputs flex-v stretch`}>
          {Object.keys(formData).map((key) => buildInputs(key))}
        </div>
        <button className="three-d-button" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default FormGenerator;
