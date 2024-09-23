const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js")
// THINGS TO REPLACE TO GET FUNCTIONAL:

//#1 REPLACE_THIS_WITH_MODEL_NAME ctrl+f or other hot key to find all and replace this with the model being interacted with. EXAMPLE: past_Transactions.
//#2 INSERT_DATA_HERE: replace with the data being sent to table in a post or update func.  EXAMPLE: {name:"Kelly","email":"kelly@gmail", "password":"kellyRulez"}
//#3 REPLACE_WITH_WHAT_DATA_YOU_WANT: replace with the data you want deconstructed out of req.body  EXAMPLE: {name,email,password}
//#4 THE PATHS: I left them blank so you could structure them as needed.

// ### GET ###

// Gets all addresses
router.get("/", async (req, res, next) => {
    try {
      const addresses = await prisma.addresses.findMany();
      res.json(addresses);
    } catch(error) {
        next(error);
        }
  });
  // Returns addresses matching id
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const addresses = await prisma.addresses.findUnique({ where: { id } });
      if (!addresses) {
        return next(gen_errors.genericNotFoundError("addresses","id",id));
      }
      res.json(addresses);
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
      const addresses = await prisma.addresses.create({ data: {INSERT_DATA_HERE}});
      res.json(addresses);
    } catch (error) {
      next(error)
    }
  });
// ### PUT ###


  // Updates addresses
  router.put("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const exists = await prisma.addresses.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("addresses","id",id));
      }
		const { REPLACE_WITH_WHAT_DATA_YOU_WANT } = await req.body;
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}
      const addresses = await prisma.addresses.update({
        where: { id },
        data: { INSERT_DATA_HERE },
      });
      res.json(addresses);
    } catch(error) {
    next(error);
    }
  });

// ### DELETE ###
  // deletes addresses matching id
router.delete("/:id", async (req, res, next) => {

    try {
      const id = +req.params.id;
      const exists = await prisma.addresses.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("addresses","id",id));
      }
      await prisma.addresses.delete({ where: { id } });
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });