const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js")
// THINGS TO REPLACE TO GET FUNCTIONAL:

//#1(Completed) REPLACE_THIS_WITH_MODEL_NAME using ctrl+f or other hot key to find all and replace this with the model being interacted with. EXAMPLE: past_Transactions.
//#2(Completed) INSERT_DATA_HERE: replace with the data being sent to table in a post or update func.  EXAMPLE: {name:"Kelly","email":"kelly@gmail", "password":"kellyRulez"}
//#3(Completed) REPLACE_WITH_WHAT_DATA_YOU_WANT: replace with the data you want deconstructed out of req.body  EXAMPLE: {name,email,password}
//#$ THE PATHS: I left them blank so you could structure them as needed.

// ### GET ###

// Gets all credit_cards
router.get("/", async (req, res, next) => {
    try {
      const credit_cards = await prisma.credit_cards.findMany();
      res.json(credit_cards);
    } catch(error) {
        next(error);
        }
  });
  // Returns credit_cards matching id
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const credit_cards = await prisma.credit_cards.findUnique({ where: { id } });
      if (!credit_cards) {
        return next(gen_errors.genericNotFoundError("credit_cards","id",id));
      }
      res.json(credit_cards);
    } catch(error) {
        next(error);
        }
  });
// ### POST ###

router.post("/", async (req, res, next) => {
    try {
      const inputs = { user_id, pin, cvc, exp_date } = await req.body;
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}
      const credit_cards = await prisma.credit_cards.create({ data: inputs});
      res.json(credit_cards);
    } catch (error) {
      next(error)
    }
  });
// ### PUT ###


  // Updates credit_cards
  router.put("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const exists = await prisma.credit_cards.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("credit_cards","id",id));
      }
		const inputs = { user_id, pin, cvc, exp_date } = await req.body;
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}
      const credit_cards = await prisma.credit_cards.update({
        where: { id },
        data:  inputs ,
      });
      res.json(credit_cards);
    } catch(error) {
    next(error);
    }
  });

// ### DELETE ###
  // deletes credit_cards matching id
router.delete("/:id", async (req, res, next) => {

    try {
      const id = +req.params.id;
      const exists = await prisma.credit_cards.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("credit_cards","id",id));
      }
      await prisma.credit_cards.delete({ where: { id } });
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });