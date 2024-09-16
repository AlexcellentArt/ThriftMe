/**
 * @module gen_errors Has helper functions for checking for and generating generic errors.
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
};
// ### GENERIC ERROR ASSEMBLY FUNCTIONS

// These will likely be moved to their own file and exported later back here in refactor.
// I advise using them to avoid writing next({status:,message:}) over and over again for the same thing being checked and resulting in the same message.

// If you don't want to use them, then just replace them with an obj in the format of {status:,message:}

// Array => String formatters
function ifArrayFormatToString(arr, formatter = commaSplitEndWithAnd) {
  if (!Array.isArray(arr)) {
    return `${arr}`;
  }
  if (arr.length === 1) {
    return `${arr[0]}`;
  }
  return formatter(arr);
}

function commaSplitEndWithAnd(arr) {
  const last = arr.pop();
  let newStr = arr.join(", ");
  return newStr + ", and " + last;
}

// Generic not found error
function genericNotFoundError(lookedFor, withKey, value) {
  return {
    status: 404,
    message: `Could not find ${lookedFor} with ${withKey} ${value}.`,
  };
}

// generic missing data Error
function genericMissingDataError(missingValues, forWhat = "input") {
  missingValues = ifArrayFormatToString(missingValues);
  return { status: 400, message: `${forWhat} is missing ${missingValues}.` };
}
function genericViolationDataError(values, violation, forWhat = "input") {
  missingValues = ifArrayFormatToString(values);
  return {
    status: 400,
    message: `${forWhat}'s ${values} is too ${violation}.`,
  };
}
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

function hasLengthViolations(
  object,
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
 * @param table table name
 * @param key key on table to check.
 * @param value value being looked for.
 * If an key on the table is found to already have that value, the following error message is returned with the following template: `Another ${table} is using ${value} as a ${key}.`
 * @returns {(Object|undefined)}
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
