import React, { useEffect,useState } from "react";
function SelectionGenerator({ label, options, handleChange }) {
  useEffect(() => {}, [label, options, handleChange]);
  // pass in an array of objects in the format of {value:"dog",text:"Canine"}, which will return an selection with an option of Canine that passes up the value dog
  //{ value: "", text: "" }
  //   const [options, setOptions] = useState([options]);
  const [previousSelection, setPreviousSelection] = useState("");
  return (
    <label name={label} key={`${label}-label`} id={`${label}-label`}>
      {label}
      <select
        name={label}
        key={`${label}-select`}
        id={`${label}-select`}
        onChange={(e) => {
          // pass to handle change the current selection and the previous selection
          handleChange
            ? handleChange(e.target.value, previousSelection)
            : console.log(e.target.value + " selected!");
          // then set the new previous selection
          setPreviousSelection(e.target.value);
        }}
      >
        {options.map((obj) => {
          try {
            return (
              <option value={obj.value}>
                {obj.text ? obj.text : obj.value}
              </option>
            );
          } catch (error) {
            console.error(
              "Could not process object. Probably was not converted to {value:,text:} first. Forcibly converting to JSON and if that doesn't work, printing in a template string"
            );
            return (
              <option value={obj.value}>
                {typeof obj[key] === "object" ? JSON.stringify(obj) : `${obj}`}
              </option>
            );
          }
        })}
      </select>
    </label>
  );
}

export default SelectionGenerator;
