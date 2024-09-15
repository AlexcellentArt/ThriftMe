const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
// ### GET ###

// Gets all user
router.get("/all", async (req, res, next) => {
  try {
    console.log("Ssssssss")
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
    const { name, email, password } = await req.body;
    [name,email,password].forEach((input)=>{})
    // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
    // ex: if {!name} {next(genericMissingDataError("name","user"))}
    const player = await prisma.user.create({ data: { INSERT_DATA_HERE } });
    res.json(player);
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
    const { name, email, password } = await req.body;
    let data = {};
    // checking if not already set to that.
    if (user.name != name) {
      data["name"] = name;
    }
    if (user.email != email) {
      const notUnique = await isNotUnique("user","email",email);
      if (notUnique) {next(notUnique)}
    }
    if (user.password != password) {
      data["password"] = password;
    }
    const user = await prisma.user.update({
      where: { id },
      data: { name: name, email: email, password: password },
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

// Generic not found error
function genericNotFoundError(lookedFor, withKey, value) {
  return {
    status: 404,
    message: `Could not find ${lookedFor} with ${withKey} ${value}.`,
  };
}

// generic missing data Error
function genericMissingDataError(missingValues, forWhat = "input") {
  if (Array.isArray(missingValues)) {
    missingValues = missingValues.join();
  }
  return { status: 400, message: `${forWhat} was missing ${missingValues}.` };
}
function hasMissingInputs(object) {
    const missing = []
    for(let key in object) {
        if (!object[key]){missing.push(key)}
      }
    return { status: 400, message: `${forWhat} was missing ${missingValues}.` };
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
