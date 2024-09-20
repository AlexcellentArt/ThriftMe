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
  isNotUnique,
  isNotType,
  genericAuthorityError,
  allInArrayAreType,wrapConsoleLog
};
/**
 * @function wrapConsoleLog
 * @description wraps the console log text in a ANSI escape code colored background to prevent easy overrides.
 * @param {String} bg background wanted, available: black, blue, red, green, magenta
 * @param {Function} formatter formatter function to run on arr if arr is array and arr.length > 2 @default commaSplitEndWithAnd
 * @returns {String}
 * @example console.log(gen_errors.wrapConsoleLog("very console, much log"))
 */
function wrapConsoleLog(log,bg="black"){
  switch (bg) {
    case "blue":
      return `\u001B[1m\u001B[36m ${log}[39m\u001B[22m`
      // break;
    case "black":
      return `\u001B[1m\u001B[44m${log}\u001B[49m\u001B[22m`
      // break;
    case "green":
      return `\u001B[1m\u001B[42m${log}\u001B[49m\u001B[22m`
    case "red":
      return `\u001B[1m\u001B[41m${log}\u001B[49m\u001B[22m`
    case "magenta":
      return `\u001B[1m\u001B[45m${log}\u001B[49m\u001B[22m`
    default:
      return `\u001B[1m\u001B[44m${log}\u001B[49m\u001B[22m`
  }
}
/**
 * @function ifArrayFormatToString
 * @description checks if the input arr is an Array and if so and arr.length > 1, runs and returns the result of putting arr through the formatter.
 * @param {Array} arr array to be joined
 * @param {Function} formatter formatter function to run on arr if arr is array and arr.length > 2 @default commaSplitEndWithAnd
 * @returns {String}
 * @example ifArrayFormatToString([1,2]) => "1 and 2"
 */
function ifArrayFormatToString(arr, formatter = commaSplitEndWithAnd) {
  if (!Array.isArray(arr)) {
    return `${arr}`;
  }
  if (arr.length === 1) {
    return `${arr[0]}`;
  }
  return `${formatter(arr)}`;
}
/**
 * @function commaSplitEndWithAnd
 * @description formats an array to a string separated by comma's and ending with the last value preceded by and.
 * @param {Array} arr array to be joined
 * @returns {String}
 * @example commaSplitEndWithAnd([1,2,3]) => "1, 2, and 3"
 */
function commaSplitEndWithAnd(arr) {
  if (arr.length === 2) {
    return `${arr[0]} and ${arr[1]}`;
  }
  const last = arr.pop();
  let newStr = arr.join(", ");
  return newStr + ", and " + last;
}

/**
 * @function pluralize
 * @description Used internally for dealing with errors that can receive arrays. Checks the length and returns 's' if > 1 and '' if not. This creates with a single check a mutable plurality to the error message.
 * @param {Int} amount used to tell if a group or not. The length of array is the most ideal input.
 * @param {String} word word being made plural if needed
 * @param {String} override word to return instead if plural.
 * @returns {String}
 * @example pluralize(2,duck) => 'ducks'
 * @example pluralize(1,duck) => 'duck'
 * @example pluralize(2,crow,murder) => 'murder'
 */
function pluralize(amount,word,override = undefined){
  if (amount>1) {return override ? override:`${word}s`}
  else return `${word}`
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
 * @example genericViolationDataError(["name","password"],"user") => "On user password and name are missing."
 */
function genericMissingDataError(missingValues, forWhat = "input") {
  const len = Array.isArray(missingValues) ? missingValues.length:0
  return { status: 400, message: `On ${forWhat} ${ifArrayFormatToString(missingValues)} ${pluralize(len,"is","are")} missing.` };
}
/**
 * @function genericViolationDataError
 * @description Loops through the keys in mandatoryKeys, trying to get them from the object. If nothing is returned, then it is added to missing. If keys are found missing, then an 400 error is returned with the message listing them out.
 * @param {Array[String]|String} values value(s) that were in violation
 * @param {String} violation the violation
 * @param {String} forWhat what to specify in the error message as to what the object/form was.
 * @returns {Object|undefined}
 * @example genericViolationDataError(["name","password"],"too short","user") => "user's password and name are too short."
 */
function genericViolationDataError(values, violation, forWhat = "input") {
  return {
    status: 400,
    message: `${forWhat}'s ${ifArrayFormatToString(values)} ${violation}.`
  };
}
/**
 * @function genericAuthorityError
 * @description Loops through the keys in mandatoryKeys, trying to get them from the object. If nothing is returned, then it is added to missing. If keys are found missing, then an 400 error is returned with the message listing them out.
 * @param {who} who did this action
 * @param {String} triedToAccess what they tried to access
 * @param {undefined|String} withWhat what invalid value they tried to access with
 * @returns {String} `${who} does not have authority to access ${triedToAccess} with ${withWhat}.` if withWhat is defined, it will end at triedToAccess
 * @example genericAuthorityError("User","another user's cart") => `User does not have authority to access another user's cart.`
 */
function genericAuthorityError(who, triedToAccess, withWhat=undefined) {
  return {
    status: 401,
    message: withWhat
      ? `${who} does not have authority to access ${triedToAccess}.`
      : `${who} does not have authority to access ${triedToAccess} with ${withWhat}.`,
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
  console.log("missing")
  console.log(missing)
  if (missing.length) {
    console.log("about to return missing")
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
  const violatingValues = [];
  // min
  if (settings.min) {
    checkKeys.forEach((key) => {
      if (object[key] < settings.min) {
        violatingValues.push(key);
      }
    });
  }
  if (violatingValues.length) {
    return genericViolationDataError(violatingValues, "too short",forWhat);
  }
  // max
  if (settings.max) {
    checkKeys.forEach((key) => {
      if (object[key] > settings.max) {
        violatingValues.push(key);
      }
    });
  }
  if (violatingValues.length) {
    return genericViolationDataError(violatingValues, "too long",forWhat);
  }
}
/**
 * @function isNotUnique
 * @description Checks a key on all entries on specified table to see if the value is already being used. If so, returns an 422 error.
 * @param {String} table table name
 * @param {String} key key on table to check.
 * @param {String} value value being looked for.
 * If an key on the table is found to already have that value, the following error message is returned with the following template: `Another ${table} is using ${value} as a ${key}.`
 * @returns {Object|undefined} `Another ${table} is using ${value} as a ${key}.`
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
/**
 * @function isNotType
 * @description Checks with typeof to see if value is equal to type. If not, returns an 400 error.
 * @param {String} label name of value being checked
 * @param {String} value value who's type is checked
 * @param {String} type type being checked for via typeof ex: object,integer,string,boolean
 * @param {String} whatFor what form/operation this is all being checked for
 * @returns {Object|undefined} `Another ${table} is using ${value} as a ${key}.`
 * @example isNotType("browsing history","hat","string","looked_at_tags")
 */
function isNotType(label, value, type = "string", whatFor = "input") {
  console.log(value,type)
  if (typeof value !== type.toLowerCase()) {
    return genericViolationDataError(label, `not a ${type}`, whatFor);
  }
}
/**
 * @function allInArrayAreType
 * @description Checks with typeof to see if value is equal to type. If not, returns an 400 error.
 * @param {String} label name of value being checked
 * @param {Array} array array who's contents will have their types checked
 * @param {String} type type being checked for via typeof ex: object,integer,string,boolean
 * @param {String} whatFor what form/operation this is all being checked for
 * @returns {Object|undefined} `Another ${table} is using ${value} as a ${key}.`
 * @example allInArrayAreType("browsing history",[],"object","looked_at_tags")
 */
function allInArrayAreType(label, array, type = "string", whatFor = "input") {
  type = type.toLowerCase()
  const notType = []
  array.forEach((value,idx)=>{if (typeof value !== type){notType.push(`[index ${idx}'s value ${value} is a ${typeof value}]`)}})
  if (notType.length){
    const len = notType.length
    return genericViolationDataError(label, `contains ${pluralize(len,"value")} that are not ${(len,type)}. The violating ${pluralize(len,"pair is","pairs are")} ${ifArrayFormatToString(notType)}`)}
}
