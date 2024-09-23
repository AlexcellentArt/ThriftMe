const router = require("express").Router();
module.exports = router;
const { compareSync } = require("bcrypt");
const prisma = require("../prisma");
const { isLoggedIn,authenticate,findUserWithToken } = require("./helpers/auth.js");
const gen_errors = require("./helpers/gen_errors.js")
require("dotenv").config().env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh'

// ### GET ###

// Gets all user
router.get("/", async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// const validateInputs = async (inputs) => {
//   const inputs = { name, email, password } = await req.body;
//   console.log(inputs)
//   const missing = gen_errors.hasMissingInputs(inputs,["name", "email", "password"],"user")
//   if (missing){
//       return next(missing)
//   }
//   // const lengthViolations = gen_errors.hasLengthViolations()
//   // if (lengthViolations){}
//   // const notUnique = await gen_errors.isNotUnique("user","email",email);
//   // if (notUnique) {next(notUnique)}
//   return null
// }
router.post("/login",async (req, res, next) => {
  console.log("LOPGGING IN")
  try {
    const {email,password} = await req.body;
    const salt = await bcrypt.genSalt(13);
    const user = await prisma.user.findUnique({ where: {email} });
    if (!user){
      return next(gen_errors.genericNotFoundError("user","email",email))
    }
    if(!compareSync(password,user.password))
    {
      return next(gen_errors.genericViolationDataError("input","password","wrong"))
    }
    const token = jwt.sign({userId: user.id},JWT)
    console.log(token)
    res.json({user,token})
  } catch (error) {
    next(error);
  }
})
router.post("/register",async (req, res, next) => {
  try {
    const inputs = await req.body
    console.log("trying to register...")
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      console.log("EXISTS")
      return next(gen_errors.genericViolationDataError("user", "email", "already in usage"));
    }
    // encrypt password
    const salt = await bcrypt.genSalt(13);
    inputs["password"] = await bcrypt.hash(inputs["password"], salt);
    // validateInputs
    const user = await prisma.user.create({ data: inputs });
    const token = jwt.sign({userId: user.id},JWT)
    console.log(token)
    res.json({user: user,token})
  } catch (error) {
    next(error);
  }
})
// Returns user matching id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
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
    console.log(inputs)
    const missing = gen_errors.hasMissingInputs(inputs,["name", "email", "password"],"user")
    if (missing){
        next(missing)
    }
    // const lengthViolations = gen_errors.hasLengthViolations()
    // if (lengthViolations){}
    // const notUnique = await gen_errors.isNotUnique("user","email",email);
    // if (notUnique) {next(notUnique)}
    const user = await prisma.user.create({ data: inputs });
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###

// Updates user
router.put("/:id",isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    console.log("not unique reached")
    const body = { name, email, password } = await req.body;
    // checking if not already set to that.
    if (user.name != name) {
        body["name"] = name;
    }
    if (user.email != email) {
      const notUnique = await gen_errors.isNotUnique("user","email",email);
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
router.delete("/:id",isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    await prisma.user.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});