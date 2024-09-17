const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
// ### GET ###

// Gets all user
router.get("/all", async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// Returns user matching id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return next(genericNotFoundError("user", "id", id));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// ### POST ###

router.post("/", async (req, res, next) => {
  try {
    const inputs = { name, email, password } = await req.body;
    // [name,email,password].forEach((input)=>{})
    // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
    // ex: if {!name} {next(genericMissingDataError("name","user"))}
    console.log(inputs)
    // const obj = {"name":name,"email":email,"password":password}
    //"password":null
    const missing = hasMissingInputs(inputs,["name", "email", "password"],"user")
    if (missing){
        next(missing)
    }
    // const lengthViolations = hasLengthViolations()
    // if (lengthViolations){}
    // const notUnique = await isNotUnique("user","email",email);
    // if (notUnique) {next(notUnique)}
    const user = await prisma.user.create({ data: inputs });
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// ### PATCH ###

// Updates user
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(genericNotFoundError("user", "id", id));
    }
    console.log("not unique reached")
    const body = { name, email, password } = await req.body;
    // checking if not already set to that.
    if (user.name != name) {
        body["name"] = name;
    }
    if (user.email != email) {
      const notUnique = await isNotUnique("user","email",email);
      if (notUnique) {next(notUnique)}
    }
    if (user.password != password) {
        body["password"] = password;
    }
    console.log("update")
    const user = await prisma.user.update({
      where: { id },
      data: body,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes user matching id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(genericNotFoundError("user", "id", id));
    }
    await prisma.user.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// ### GENERIC ERROR ASSEMBLY FUNCTIONS

// These will likely be moved to their own file and exported later back here in refactor.
// I advise using them to avoid writing next({status:,message:}) over and over again for the same thing being checked and resulting in the same message.

// If you don't want to use them, then just replace them with an obj in the format of {status:,message:}

// Array => String formatters
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
      message: `Another ${lookedFor} is using ${value} as a ${key}.`,
    };
  }
  return null;
}
