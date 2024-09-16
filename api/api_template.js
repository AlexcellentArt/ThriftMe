const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

// THINGS TO REPLACE TO GET FUNCTIONAL:

// REPLACE_THIS_WITH_MODEL_NAME using ctrl+f or other hot key to find all and replace this with the model being interacted with. EXAMPLE: past_Transactions.
// INSERT_DATA_HERE: replace with the data being sent to table in a post or update func.  EXAMPLE: {name:"Kelly","email":"kelly@gmail", "password":"kellyRulez"}
// REPLACE_WITH_WHAT_DATA_YOU_WANT: replace with the data you want deconstructed out of req.body  EXAMPLE: {name,email,password}
// THE PATHS: I left them blank so you could structure them as needed.
// ### GET ###

// Gets all REPLACE_THIS_WITH_MODEL_NAME
router.get("/", async (req, res, next) => {
    try {
      const REPLACE_THIS_WITH_MODEL_NAME = await prisma.REPLACE_THIS_WITH_MODEL_NAME.findMany();
      res.json(REPLACE_THIS_WITH_MODEL_NAME);
    } catch(error) {
        next(error);
        }
  });
  // Returns REPLACE_THIS_WITH_MODEL_NAME matching id
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const REPLACE_THIS_WITH_MODEL_NAME = await prisma.REPLACE_THIS_WITH_MODEL_NAME.findUnique({ where: { id } });
      if (!REPLACE_THIS_WITH_MODEL_NAME) {
        return next(genericNotFoundError("REPLACE_THIS_WITH_MODEL_NAME","id",id));
      }
      res.json(REPLACE_THIS_WITH_MODEL_NAME);
    } catch(error) {
        next(error);
        }
  });
// ### POST ###

router.post("/", async (req, res, next) => {
    try {
      const { REPLACE_WITH_WHAT_DATA_YOU_WANT } = await req.body;
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}
      const REPLACE_THIS_WITH_MODEL_NAME = await prisma.REPLACE_THIS_WITH_MODEL_NAME.create({ data: {INSERT_DATA_HERE}});
      res.json(REPLACE_THIS_WITH_MODEL_NAME);
    } catch (error) {
      next(error)
    }
  });
// ### PATCH ###


  // Updates REPLACE_THIS_WITH_MODEL_NAME
  router.put("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const exists = await prisma.REPLACE_THIS_WITH_MODEL_NAME.findUnique({ where: { id } });
      if (!exists) {
        return next(genericNotFoundError("REPLACE_THIS_WITH_MODEL_NAME","id",id));
      }
		const { REPLACE_WITH_WHAT_DATA_YOU_WANT } = await req.body;
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}
      const REPLACE_THIS_WITH_MODEL_NAME = await prisma.REPLACE_THIS_WITH_MODEL_NAME.update({
        where: { id },
        data: { INSERT_DATA_HERE },
      });
      res.json(REPLACE_THIS_WITH_MODEL_NAME);
    } catch(error) {
    next(error);
    }
  });

// ### DELETE ###
  // deletes REPLACE_THIS_WITH_MODEL_NAME matching id
router.delete("/:id", async (req, res, next) => {

    try {
      const id = +req.params.id;
      const exists = await prisma.REPLACE_THIS_WITH_MODEL_NAME.findUnique({ where: { id } });
      if (!exists) {
        return next(genericNotFoundError("REPLACE_THIS_WITH_MODEL_NAME","id",id));
      }
      await prisma.REPLACE_THIS_WITH_MODEL_NAME.delete({ where: { id } });
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });

// ### GENERIC ERROR ASSEMBLY FUNCTIONS

// These will likely be moved to their own file and exported later back here in refactor. 
// I advise using them to avoid writing next({status:,message:}) over and over again for the same thing being checked and resulting in the same message.

// If you don't want to use them, then just replace them with an obj in the format of {status:,message:}

function ifArrayFormatToString(arr,formatter=commaSplitEndWithAnd){
    if (!Array.isArray(arr)){return `${arr}`}
    if (arr.length === 1){return `${arr[0]}`}
    return formatter(arr)
}

function commaSplitEndWithAnd(arr){
    const last = arr.pop()
    let newStr = arr.join(", ")
    return newStr+", and "+last
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
    return { status: 400, message: `${forWhat}'s ${values} is too ${violation}.` };
  }
function hasMissingInputs(object,mandatoryKeys, forWhat = "input") {
    const missing = []
    mandatoryKeys.forEach((key)=>{if (!object[key]){missing.push(key)}})
    if (missing.length){return genericMissingDataError(missing,forWhat);}
  }

function hasLengthViolations(object,settings={min:1,max:undefined}, forWhat = "input") {
    const violation = []
    // min
    if (settings.min){checkKeys.forEach((key)=>{if (object[key] < settings.min){violation.push(key)}})}
    if (violation.length){return genericViolationDataError(forWhat,violation,input)}
    // max
    if (settings.max){checkKeys.forEach((key)=>{if (object[key] > settings.max){violation.push(key)}})}
    if (violation.length){return genericViolationDataError(forWhat,violation,input)}
  }
// Returns null if unique, otherwise an error message
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