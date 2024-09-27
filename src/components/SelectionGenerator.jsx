import React, { useEffect,useState } from "react";
function SelectionGenerator({ label, options, handleChange }) {
  useEffect(() => {}, [label, options, handleChange]);
  // pass in an array of objects in the format of {value:"dog",text:"Canine"}, which will return an selection with an option of Canine that passes up the value dog
  //{ value: "", text: "" }
  const [trueVals, setTrueVals] = useState(options);
  const [previousSelection, setPreviousSelection] = useState("");
  function buildOptions(){
    const html = []
    const vals = []
    options.forEach((obj,idx)=> {
      vals.push(obj.value);
     html.push( createReactHTML(obj,idx))})
    //  setTrueVals(vals)
    console.log(vals)
    return html
    // options.map((obj,idx) => {
    //   // mapped to an index in case of obj or array values
    //   // console.log(obj,idx)
    //   // options[idx] = obj.value
    //   try {
    //     return (
    //       <option value={idx}>
    //         {obj.text ? obj.text : obj.value}
    //       </option>
    //     );
    //   } catch (error) {
    //     console.error(
    //       "Could not process object. Probably was not converted to {value:,text:} first. Forcibly converting to JSON and if that doesn't work, printing in a template string"
    //     );
    //     return (
    //       <option value={idx}>
    //         {typeof obj[key] === "object" ? JSON.stringify(obj) : `${obj}`}
    //       </option>
    //     );
    //   }
    // })}
  }
  function createReactHTML(obj,idx){
    try {
      return (
        <option value={idx}>
          {obj.text ? obj.text : obj.value}
        </option>
      );
    } catch (error) {
      console.error(
        "Could not process object. Probably was not converted to {value:,text:} first. Forcibly converting to JSON and if that doesn't work, printing in a template string"
      );
      return (
        <option value={idx}>
          {typeof obj[key] === "object" ? JSON.stringify(obj) : `${obj}`}
        </option>
      );
    }
  }
  return (
    <label name={label} key={`${label}-label`} id={`${label}-label`}>
      {label}
      <select
        name={label}
        key={`${label}-select`}
        id={`${label}-select`}
        onChange={(e) => {
          console.log(e.target.value)
          // console.log(options[e.target.value])
          // get actual value via index 
          console.log(trueVals)
          const val = trueVals[e.target.value].value
          // pass to handle change the current selection and the previous selection
          // console.log(val)
          console.log(val + " selected!")
          handleChange
          // returns the true value, the index of the current value, and the previously selected value.
            ? handleChange(val,e.target.value, previousSelection)
            : console.log(val + " selected!");
          // then set the new previous selection
          setPreviousSelection(val);
        }}
      >
        {buildOptions()}
      </select>
    </label>
  );
}

export default SelectionGenerator;
