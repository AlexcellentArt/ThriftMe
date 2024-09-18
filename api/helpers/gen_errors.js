/**
 * @module gen_errors Has helper functions for checking for and generating generic errors. To import, paste this line at the top of your file in api: const gen_errors = require("./helpers/gen_errors"), then simply get the functions from it. Example: gen_errors.commaSplitEndWithAnd([1,2,3])
 * */
module.exports = {
  ifArrayFormatToString,
  commaSplitEndWithAnd,
  genericMissingDataError,
  genericNotFoundError,
  genericViolationDataError,
  hasMissingInputs,
  hasLengthViolations,
  isNotUnique,isNotType
};
/**
 * @function ifArrayFormatToString
 * @description checks if the input arr is an Array and if so and arr.length > 1, runs and returns the result of putting arr through the formatter.
 * @param {Array} arr array to be joined
 * @param {Function} formatter formatter function to run on arr if arr is array and arr.length > 1 @default commaSplitEndWithAnd
 * @returns {String}
 * @example ifArrayFormatToString([1,2,3]) => "1, 2, and 3"
 */
function ifArrayFormatToString(arr, formatter = commaSplitEndWithAnd) {
  if (!Array.isArray(arr)) {
    return `${arr}`;
  }
  if (arr.length === 1) {
    return `${arr[0]}`;
  }
  return formatter(arr);
}
/**
 * @function commaSplitEndWithAnd
 * @description formats an array to a string separated by comma's and ending with the last value preceded by and.
 * @param {Array} arr array to be joined
 * @returns {String} 
 * @example genericViolationDataError([1,2,3]) => "1, 2, and 3"
 */
function commaSplitEndWithAnd(arr) {
  const last = arr.pop();
  let newStr = arr.join(", ");
  return newStr + ", and " + last;
}

/**
 * @function genericNotFoundError
 * @description Creates a 404 error with a message with the template `Could not find ${lookedFor} with ${withKey} ${value}.`
 * @param {String} lookedFor table name
 * @param {String} forWhat what to specify in the error message as to what the object/form was.
 * @param {String} value value that was not found
 * @returns {Object}
 * @example genericViolationDataError("user","id",222)
 */
function genericNotFoundError(lookedFor, withKey, value) {
  return {
    status: 404,
    message: `Could not find ${lookedFor} with ${withKey} ${value}.`,
  };
}
/**
 * @function genericMissingDataError
 * @description Creates a 400 error with a message with the template `${forWhat} is missing ${missingValues}.`
 * @param {Array[String]|String} missingValues value(s) that were missing
 * @param {String} forWhat what to specify in the error message as to what the object/form was.
 * @returns {Object}
 * @example genericViolationDataError(["name","password"],"user")
 */
function genericMissingDataError(missingValues, forWhat = "input") {
  missingValues = ifArrayFormatToString(missingValues);
  return { status: 400, message: `${forWhat} is missing ${missingValues}.` };
}
/**
 * @function genericViolationDataError
 * @description Loops through the keys in mandatoryKeys, trying to get them from the object. If nothing is returned, then it is added to missing. If keys are found missing, then an 400 error is returned with the message listing them out. 
 * @param {Array[String]|String} values value(s) that were in violation
 * @param {String} violation the violation
 * @param {String} forWhat what to specify in the error message as to what the object/form was.
 * @returns {Object|undefined}
 * @example genericViolationDataError(["name","password"],"short","user")
 */
function genericViolationDataError(values, violation, forWhat = "input") {
  missingValues = ifArrayFormatToString(values);
  return {
    status: 400,
    message: `${forWhat}'s ${values} is ${violation}.`,
  };
}
/**
 * @function hasMissingInputs
 * @description Loops through the keys in mandatoryKeys, trying to get them from the object. If nothing is returned, then it is added to missing. If keys are found missing, then an 400 error is returned with the message listing them out.
 * @param {Object} object object being checked
 * @param {Array[String]} mandatoryKeys what keys to check on object
 * @param {String} forWhat what to specify in the error message as to what the object/form was.
 * @returns {Object|undefined}
 * @example hasMissingInputs({name:"Larry",password:"birdbirdbird"}, ["name","password"], "user")
 */
function hasMissingInputs(object, mandatoryKeys, forWhat = "input") {
  const missing = [];
  mandatoryKeys.forEach((key) => {
    if (!object[key]) {
      missing.push(key);
    }
  });
  if (missing.length) {
    return genericMissingDataError(missing, forWhat);
  }
}
/**
 * @function hasLengthViolations
 * @description Checks a key on all entries on specified table to see if the value is shorter/longer than min and/or max if either is defined in settings. If so, returns an 422 error.
 * @param {Object} object object being checked
 * @param {Array[String]} checkKeys what keys to check on object
 * @param {Object} settings {min: Int||undefined , max: Int||undefined}
 * @returns {Object|undefined}
 * @example hasLengthViolations({name:"Larry",password:"birdbirdbird"}, ["name","password"], {min:1,max:225})
 */
function hasLengthViolations(
  object,
  checkKeys,
  settings = { min: 1, max: undefined },
  forWhat = "input"
) {
  const violation = [];
  // min
  if (settings.min) {
    checkKeys.forEach((key) => {
      if (object[key] < settings.min) {
        violation.push(key);
      }
    });
  }
  if (violation.length) {
    return genericViolationDataError(forWhat, violation, input);
  }
  // max
  if (settings.max) {
    checkKeys.forEach((key) => {
      if (object[key] > settings.max) {
        violation.push(key);
      }
    });
  }
  if (violation.length) {
    return genericViolationDataError(forWhat, violation, input);
  }
}
/**
 * @function isNotUnique
 * @description Checks a key on all entries on specified table to see if the value is already being used. If so, returns an 422 error.
 * @param {String} table table name
 * @param {String} key key on table to check.
 * @param {String} value value being looked for.
 * If an key on the table is found to already have that value, the following error message is returned with the following template: `Another ${table} is using ${value} as a ${key}.`
 * @returns {Object|undefined}
 * @example isNotUnique("user", "id", 25)
 */
async function isNotUnique(table, key, value) {
  const alreadyUsed = await prisma[table].findUnique({ where: { key } });
  if (alreadyUsed) {
    return {
      status: 422,
      message: `Another ${table} is using ${value} as a ${key}.`,
    };
  }
  return null;
}
function isNotType(label,value,type="string",whatFor="input"){
  if(!typeof value === type.toLowerCase()){
    return genericViolationDataError(label,`not a ${type}`,whatFor)
  }
}
