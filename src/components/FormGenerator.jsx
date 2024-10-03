import React, { useState, useReducer, useEffect,useContext } from "react";
import SelectionGenerator from "./SelectionGenerator";
import PhotoInput from "./PhotoInput"
import { AuthContext } from "./AuthContext";

function FormGenerator({
  fields,
  autofillOptions,
  autoFillOptionFormatter,
  fetchFunctionOverride,
  postSuccessFunction = null,
  apiPath,
  labelAdditionalClasses = "",
  fetch_method = "POST",
  additionalDataToSend,
  preprocessPost
}) {
  useEffect(() => {
  }, [fields]);
  const {token} = useContext(AuthContext)
  // version is used to force rereneder of form
  const [version, setVersion] = useState(0);
  // states related to handling visualization of errors
  const [error, setError] = useState();
  const [isFirstTry, setIsFirstTry] = useState(true);
  // states and reducers related to direct manipulation of the form and data within
  const [formData, dispatch] = useReducer(
    formDataReducer,
    createInitialValues()
  );

  const [newFormData, setNewFormData] = useState( ()=>{   const emptyForm = {};
    Object.keys(fields).forEach((key) => {
      emptyForm[key] = "";
    });
    return emptyForm});

  const [autoFillData, autoFillDispatch] = useReducer(
    autoFillDataReducer,
    createAutoFillOptions()
  );

  function autoFillDataReducer(data, action) {
    switch (action.type) {
      case "reload": {
        data = createAutoFillOptions();
        setVersion(version + 1);
        return data;
      }
      case "updateNew": {
        data[0].value = action.newData;
        return data;
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  }
  function createAutoFillOptions() {
    if (!autofillOptions) {
      return {};
    }
    // New will always be 0 by default
    try {
      const options = [];
      if (newFormData !== undefined) {
        options.push({ value: newFormData, text: "New" });
      }

      // if autoFillOptionFormatter, then use it.
      const formatter = autoFillOptionFormatter
        ? autoFillOptionFormatter
        : (obj) => {
            return { value: obj, text: JSON.stringify(obj) };
          };
      autofillOptions.forEach((op) => {
        options.push(formatter(op));
      });
      return options;
    } catch (error) {
    }
    return {};
  }
  // ### FORM DATA SETUP ###

  function createInitialValues(initialValue = "") {
    const obj = {};
    fields.forEach((field) => {
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
    });
    return obj;
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
      case "autofill": {
        Object.entries(action.filled).forEach((entry) => {
          const key = entry[0];
          const value = entry[1];
          if (data[key]) {
            data[key].isValid = true;
            data[key].value = value;
            data[key].default = value;
          }
        });
        return data;
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  }
  // ### FORM DATA HANDLERS ###
  async function handleUpdateFormData(type, key, value = "") {
    // if input type is one that works with strings, trim the value
    if (type === "text" || "email") {
      if (type !== "multiple files"){value = value.trim();}
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
  async function handleAutofillFormData(formData) {
    dispatch({
      type: "autofill",
      filled: formData,
    });
    setVersion(version + 1);
  }
  async function handleSubmit(e) {
    e.preventDefault();
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
  // ### FORM DATA HELPER FUNCTIONS ###
  function compileFormData() {
    const obj = {};
    Object.entries(formData).forEach((data) => {
      obj[data[0]] = data[1].value;
    });
    return obj;
  }
  function commaSplitEndWithAnd(arr) {
    if (arr.length === 2) {
      return `${arr[0]} and ${arr[1]}`;
    }
    const last = arr.pop();
    let newStr = arr.join(", ");
    return newStr + ", and " + last;
  }
  async function defaultFetch(url, obj, setError = null) {
    const API_URL = `/api/${url}`;
    try {
      if (additionalDataToSend) {
        obj = { obj, ...additionalDataToSend };
      }
      if(preprocessPost){
        obj = preprocessPost(obj)
      }
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
      return null;
    }
  }
  // ### FORM DATA VALIDATION FUNCTIONS ###
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
  // ### FORM ASSEMBLY FUNCTIONS ###
  function createInputClassName(base = "", key) {
    let label = `${base} ${labelAdditionalClasses !== undefined?labelAdditionalClasses:""} ${formData[key].classes?formData[key].classes:""}`
    // if(formData[key].classes !== undefined){label = formData[key].classes}
    if (!isFirstTry && formData[key].isValid === false) {
      label += " error";
    }
    return label
  }
  function makeLabel(key, content) {
    const additonal = createInputClassName(formData[key].type, key)
    return (
      <label
        className={
          "merriweather-bold " + additonal 
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
    }
  }
  function buildInputs(inputKey) {
    //DOCUMENTATION: based on type, content is generated and setup according to what's at the key in formData. Label is setup the same way, with content being placed inside it.
    let content;
    // specialized types get their own cases, while all non specialized get made by make input
    switch (formData[inputKey].type) {
      case "textarea":
        content =  (
          <textarea
            className="merriweather-regular"
            name={inputKey}
            id={inputKey}
            htmlFor={inputKey}
            onChange={(e) =>
              handleUpdateFormData(e.target.type, inputKey, e.target.value)
            }
            defaultValue={formData[inputKey].default}
            rows={formData[inputKey].rows?formData[inputKey].rows:3}
            cols={formData[inputKey].cols?formData[inputKey].cols:55}
          />
        );
        break
      case "multiple files":
        function updateFiles(files,inputKey)
        {
          handleUpdateFormData("multiple files", inputKey, files)

        }
        content =
        <PhotoInput inputKey={inputKey} update={updateFiles}/>
        break
      default:
        content = makeInput(inputKey);
    }
    return makeLabel(inputKey, content);
  }
  return (
    <>
      {autofillOptions && (
        <SelectionGenerator
          label="Use: "
          // if there is a formatter, run the options through that
          options={autoFillData}
          handleChange={(obj, idx, prev) => {
            if (prev === 0) {
              // previous selection was new, save the form's current state before updating
              setNewFormData(formData);
              autoFillDispatch({
                type: "updateNew",
                newData: formData,
              });
            }
            if (idx === 0) {
              handleAutofillFormData(autoFillData[0]);
            } else {
              handleAutofillFormData(obj);
            }
          }}
        />
      )}
      <form
        className="generated-form"
        key="form"
        id="form"
        onSubmit={handleSubmit}
      >
        {error && <p>{error}</p>}
        <div key={version} className={`form-inputs flex-v stretch`}>
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
