const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js")
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
        return next(gen_errors.genericNotFoundError("item","id",id));
      }
      res.json(item);
    } catch(error) {
        next(error);
        }
  });
// get search, filtered or otherwise
router.get("/search", async (req, res, next) => {
  try {
    const { search_text, tags } = await req.body;
    // if no search_text or tags, return all items
    if (search_text = "" && tags.length === 0){
      const item = await prisma.item.findMany();
      res.json(item);
      }
    // otherwise return filtered
      const getFiltered = await prisma.item.findMany({
        where: {
          name: {
            string_contains: search_text
          },
          tags:{
            array_contains: tags,
          }
        },
      })
    // if get filtered is nothing, return empty array
    if (!getFiltered) {
      console.log("No Matches found for filter of ")
      console.log(`No Matches found for filter of name: ${search_text} tags:${tags}`)
      getFiltered = []
    }
    res.json(getFiltered);
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

      const missing = gen_errors.hasMissingInputs(inputs,["name", "price", "description"],"item")
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
// ### PUT ###


  // Updates item
  router.put("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const exists = await prisma.item.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("item","id",id));
      }
		const inputData = { name, price, description, default_photo, additional_photos, tags } = await req.body;
        //>REPLACE_WITH_WHAT_DATA_YOU_WANT inserted inserted {name, price, description}
      // write your own checks to validate obj here and if it fails, run next(genericMissingDataError(missingValues,forWhat))
      // ex: if {!name} {next(genericMissingDataError("name","user"))}

      // const missing = gen_errors.hasMissingInputs(inputs,["name", "price", "description"],"item")
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
        return next(gen_errors.genericNotFoundError("item","id",id));
      }
      await prisma.item.delete({ where: { id } });
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });