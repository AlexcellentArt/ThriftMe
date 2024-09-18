const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
import {hasMissingInputs,genericNotFoundError,hasMissingInputs} from "./helpers/gen_errors"
// THINGS TO REPLACE TO GET FUNCTIONAL:

//#1 item using ctrl+f or other hot key to find all and replace this with the model being interacted with. EXAMPLE: past_Transactions.
//#2 INSERT_DATA_HERE: replace with the data being sent to table in a post or update func.  EXAMPLE: {name:"Kelly","email":"kelly@gmail", "password":"kellyRulez"}
//#3 REPLACE_WITH_WHAT_DATA_YOU_WANT: replace with the data you want deconstructed out of req.body  EXAMPLE: {name,email,password}
//#4 THE PATHS: I left them blank so you could structure them as needed.

// ### GET ###

// Gets all item
router.get("/", async (req, res, next) => {
    try {
      const item = await prisma.item.findMany();
      res.json(item);
    } catch(error) {
        next(error);
        }
  });
  // Returns item matching id
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const item = await prisma.item.findUnique({ where: { id } });
      if (!item) {
        return next(genericNotFoundError("item","id",id));
      }
      res.json(item);
    } catch(error) {
        next(error);
        }
  });
// ### POST ###

router.post("/", async (req, res, next) => {
    try {
      const inputs = { name, price, description, default_photo, additional_photos, tags } = await req.body;
      //>REPLACED_WITH_WHAT_DATA_YOU_WANT inserted {name, price, description}
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}
      console.log(inputs)

      const missing = hasMissingInputs(inputs,["name", "price", "description"],"item")
    if (missing){
        next(missing)
    }
  
      const item = await prisma.item.create({ data: inputs });
      //>INSERT_DATA_HERE inserted inputs
      res.json(item);
    } catch (error) {
      next(error)
    }
  });
// ### PATCH ###


  // Updates item
  router.put("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const exists = await prisma.item.findUnique({ where: { id } });
      if (!exists) {
        return next(genericNotFoundError("item","id",id));
      }
		const inputData = { name, price, description, default_photo, additional_photos, tags } = await req.body;
        //>REPLACE_WITH_WHAT_DATA_YOU_WANT inserted inserted {name, price, description}
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}

      // const missing = hasMissingInputs(inputs,["name", "price", "description"],"item")
      // if (missing){
      //     next(missing)
      // }
      const item = await prisma.item.update({
        where: { id },
        data:  inputData ,
      });
      res.json(item);
    } catch(error) {
    next(error);
    }
  });

// ### DELETE ###
  // deletes item matching id
router.delete("/:id", async (req, res, next) => {

    try {
      const id = +req.params.id;
      const exists = await prisma.item.findUnique({ where: { id } });
      if (!exists) {
        return next(genericNotFoundError("item","id",id));
      }
      await prisma.item.delete({ where: { id } });
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });