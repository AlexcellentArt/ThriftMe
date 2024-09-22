import React, { useState, useEffect } from "react";
function DisplayMany({ data = [], factory = undefined, emptyDataText = "" , additionalClasses}) {
  useEffect(() => {
    console.log("Display Many Reload Triggered");
  }, [data]);
  // DOCUMENTATION: defaultFactory is what Display defaults to if no itemFactory is given
  function defaultFactory(obj) {
    const keys = Object.keys(obj);
    return (
      <>
        {keys.map((key) => {
          return (
            <div key={`${key}_holder`} id={`${key}_holder`}>
              <p>{`${key} : ${obj[key]}`}</p>
            </div>
          );
        })}
      </>
    );
  }

  function runFactory(obj, idx) {
    try {
      if (obj === null || undefined) {
        throw new Error(
          `Factory was given a null or undefined object at index ${idx} and it was skipped.`
        );
      }
      const out = factory(obj);
      if (obj === null) {
        throw new Error("Factory returned null");
      }
      return out;
    } catch (error) {
      console.error(error);
      return defaultFactory(obj);
    }
  }
  function autoKeyAndID(idx, factoryOutput) {
    return (
      <span key={idx} id={idx}>
        {factoryOutput}
      </span>
    );
  }
  return (
    <div className={`display-many ${additionalClasses}`}>
      {
        //DOCUMENTATION: If length is 0, return no matches and display the emptyDataText
        !data.length ? (
          <h3>{emptyDataText}</h3>
        ) : (
          //DOCUMENTATION: Else, return the data array's objects run through mapping to a factory that outputs a react component displaying the keys/values of the object as inside the factory function.
          Object.values(data).map((value, i) => {
            //DOCUMENTATION: The factory output will automatically be wrapped in a span key'd and id'd as it's index in data.
            return autoKeyAndID(i, runFactory(value));
          })
        )
      }
    </div>
  );
}

export default DisplayMany;
