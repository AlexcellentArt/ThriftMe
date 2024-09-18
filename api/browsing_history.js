const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma/index.js");
const gen_errors = require("./helpers/gen_errors.js")
// THINGS TO REPLACE TO GET FUNCTIONAL:

// browsing_History using ctrl+f or other hot key to find all and replace this with the model being interacted with. EXAMPLE: past_Transactions.
// INSERT_DATA_HERE: replace with the data being sent to table in a post or update func.  EXAMPLE: {name:"Kelly","email":"kelly@gmail", "password":"kellyRulez"}
// REPLACE_WITH_WHAT_DATA_YOU_WANT: replace with the data you want deconstructed out of req.body  EXAMPLE: {name,email,password}
// THE PATHS: I left them blank so you could structure them as needed.
// ### GET ###

// Gets all browsing_History
router.get("/", async (req, res, next) => {
    try {
      const browsing_History = await prisma.browsing_History.findMany();
      res.json(browsing_History);
    } catch(error) {
        next(error);
        }
  });
  // Returns browsing_History matching id
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const browsing_History = await prisma.browsing_History.findUnique({ where: { id } });
      if (!browsing_History) {
        return next(gen_errors.genericNotFoundError("browsing_History","id",id));
      }
      res.json(browsing_History);
    } catch(error) {
        next(error);
        }
  });
    // Returns browsing_History matching user_id
    router.get("/:user_id/:id", async (req, res, next) => {
      try {
        const id = +req.params.id;
        const user_id = +req.params.user_id;

        const browsing_History = await prisma.browsing_History.findUnique({ where: { id } });
        if (!browsing_History) {
          return next(gen_errors.genericNotFoundError("browsing_History","id",id));
        }
        if (browsing_History.user_id !== user_id){
          return next(gen_errors.genericAuthorityError("User","another Users' browsing history",user_id))
        }
        res.json(browsing_History);
      } catch(error) {
          next(error);
          }
    });
// ### POST ###

router.post("/", async (req, res, next) => {
    try {
      const { id, user_id,looked_at_tags } = await req.body;
      console.log(user_id,looked_at_tags )
      const isType = gen_errors.isNotType("browsing history",looked_at_tags,"object","looked_at_tags")
      console.log(isType)
      if (isType){return next(isType)}
      const doesNotContainOnlyStrings = gen_errors.allInArrayAreType("browsing history",looked_at_tags,"string","looked_at_tags")
      console.log(doesNotContainOnlyStrings)
      if (doesNotContainOnlyStrings){return next(doesNotContainOnlyStrings)}
      const browsing_History = await prisma.browsing_History.create({ data: { id,user_id,looked_at_tags }});
      res.json(browsing_History);
    } catch (error) {
      next(error)
    }
  });
// ### PUT ###


  // Updates browsing_History
  router.put("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const exists = await prisma.browsing_History.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("browsing_History","id",id));
      }
      const body = { user_id,looked_at_tags } = await req.body;
      const browsing_History = await prisma.browsing_History.update({
        where: { id },
        data: body,
      });
      res.json(browsing_History);
    } catch(error) {
    next(error);
    }
  });

// ### DELETE ###
  // deletes browsing_History matching id
router.delete("/:id", async (req, res, next) => {

    try {
      const id = +req.params.id;
      const exists = await prisma.browsing_History.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("browsing_History","id",id));
      }
      await prisma.browsing_History.delete({ where: { id } });
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });