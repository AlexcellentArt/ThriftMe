const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
import {hasMissingInputs,genericNotFoundError,hasMissingInputs} from "./helpers/gen_errors"
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