const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
import {hasLengthViolations,isNotUnique,hasMissingInputs,genericNotFoundError,hasMissingInputs} from "./helpers/gen_errors"
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