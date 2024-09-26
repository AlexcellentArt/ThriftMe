import React, { useEffect } from "react";
function SelectionGenerator({ label, options, handleChange }) {
//   useEffect(() => {}, [label, options, passChange]);
  // pass in an array of objects in the format of {value:"dog",text:"Canine"}, which will return an selection with an option of Canine that passes up the value dog
//   const [options, setOptions] = useState([options]);
  return (
    <select
      name={label}
      id={`${label}-select`}
      onChange={(e) => {
        handleChange(e.target.value);
      }}
    >
      {options.map((obj) => {
        return (
          <option value={obj.value}>{obj.text ? obj.text : obj.value}</option>
        );
      })}
    </select>
  );
}

export default SelectionGenerator;
