const router = require("express").Router();
module.exports = router;
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js");
// THINGS TO REPLACE TO GET FUNCTIONAL:

//#1(Completed) REPLACE_THIS_WITH_MODEL_NAME ctrl+f or other hot key to find all and replace this with the model being interacted with. EXAMPLE: past_Transactions.
//#2(Completed) INSERT_DATA_HERE: replace with the data being sent to table in a post or update func.  EXAMPLE: {name:"Kelly","email":"kelly@gmail", "password":"kellyRulez"}
//#3(Completed) REPLACE_WITH_WHAT_DATA_YOU_WANT: replace with the data you want deconstructed out of req.body  EXAMPLE: {name,email,password}
//#4 THE PATHS: I left them blank so you could structure them as needed.

// ### GET ###

// Gets all addresses
router.get("/", async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany();
    res.json(addresses);
  } catch (error) {
    next(error);
  }
});
// Returns address matching id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) {
      return next(gen_errors.genericNotFoundError("address", "id", id));
    }
    res.json(address);
  } catch (error) {
    next(error);
  }
});
// ### POST ###

router.post("/", async (req, res, next) => {

    try {
      const inputs = { user_id, zip, street, apartment } = await req.body;
      const isMissingInputs = gen_errors.hasMissingInputs(inputs,["user_id","zip","street"])
      if(isMissingInputs){return next(isMissingInputs)}
      // const isZip5 = gen_errors.hasLengthViolations(inputs,["zip"],{min:5,max:5})
      // if (isZip5){return next(isZip5)}
      const address = await prisma.address.create({ data: inputs});
      res.json(address);
    } catch (error) {
      next(error)
    }
    const address = await prisma.address.create({ data: inputs });
    res.json(address);
  });
// ### PUT ###

// Updates address
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.address.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("address", "id", id));
    }
    const inputs = ({ user_id, zip, street, apartment } = await req.body);
    // check inputs
    const isMissingInputs = gen_errors.hasMissingInputs(inputs,["user_id","zip","street"])
    if(isMissingInputs){return next(isMissingInputs)}
    // const isZip5 = gen_errors.hasLengthViolations(inputs,["zip"],{min:5,max:5})
    // if (isZip5){return next(isZip5)}
    // safe to put
      const address = await prisma.address.update({
        where: { id },
        data:  inputs ,
      });
      if (inputs.is_default != exists.is_default){
        // if so, make sure no others are set as such
        const current = await prisma.address.findFirst({
          where: { user_id:exists.user_id, is_default:true },
        });
        if (current)
        {
          current["is_default"] = false;
          await prisma.address.update({
            where: { id:current.id },
            data: current,
          });
        }
      }
      res.json(address);
    } catch(error) {
    next(error);
  }
});

// ### DELETE ###
// deletes address matching id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.address.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("address", "id", id));
    }
    await prisma.address.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
