const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js")

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
  // get search, filtered or otherwise
router.get("/search", async (req, res, next) => {
  try {
    console.log("search request got")
    let tags = undefined;
    let search_text = undefined;
    // try to get keys off query if they exist
    if (Object.keys(req.query).length !== 0)
    {console.log("has query content")
      try {
        if (req.query.search_text){search_text = JSON.parse(req.query.search_text);}
        if (req.query.tags){tags = JSON.parse(req.query.tags);}
      } catch (error) {
        next(error)
      }
    }
    // try to get keys off body if they exist && search_text and tags are not already filled
    if (Object.keys(req.body).length !== 0)
    {
      console.log("has body content")
        if (search_text === undefined || ''){search_text = await req.body.search_text;}
        if (tags === undefined){tags = await req.body.tags;}
    }
    console.log(tags,search_text)
    console.log("query got")
    // console.log("p "+params)
    // const { search_text, tags } = await req.body;
    console.log(search_text,tags)
    // if no search_text and tags, return all items
    if (search_text === undefined && tags === undefined){
      console.log("returning all")
      const item = await prisma.item.findMany();
      return res.json(item);
      }
    console.log("Building Search settings....")
    const search = {}
    if(tags !== undefined){
      search["tags"]={
          hasSome: tags,
        }}
    if (search_text !== undefined){
      search["name"]={
      contains: search_text,
      mode: 'insensitive'
    }}
    // log search settings in very visible black bg in terminal for later checking
    console.log(gen_errors.wrapConsoleLog("=====VVV SEARCH SETTINGS VVV====="))
    console.table(search)
    console.log(gen_errors.wrapConsoleLog("=====^^^ SEARCH SETTINGS ^^^====="))
      const getFiltered = await prisma.item.findMany({
        where: search
      })
    // if get filtered is nothing, return empty array
    if (!getFiltered) {
      console.log("No Matches found for filter of ")
      console.log(`No Matches found for filter of name: ${search_text} tags:${tags}`)
      return res.json([])
    }
    return res.json(getFiltered);
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

// ### POST ###

router.post("/", async (req, res, next) => {
    try {
      const inputs = {seller_id, name, price, description, default_photo, additional_photos, tags } = await req.body;
      console.log(inputs)
      const missing = gen_errors.hasMissingInputs(inputs,["name", "price", "description","default_photo", "additional_photos", "tags"],"item")
    if (missing){
      console.log("is missing")
      console.log(missing)
        return next(missing)
    }
    const isPriceNumber = gen_errors.isNotType("price",inputs.price,"number","item")
    if (isPriceNumber)
    {
      return next(isPriceNumber)
    }
    console.log(inputs)
      const item = await prisma.item.create({ data: inputs });
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
      const inputs = { name, price, description, default_photo, additional_photos, tags } = await req.body;
      inputs["seller_id"] = exists.seller_id
      console.log(inputs)
      const missing = gen_errors.hasMissingInputs(inputs,["name", "price", "description","default_photo", "additional_photos", "tags"],"item")
    if (missing){
      return next(missing)
    }
    const isPriceNumber = gen_errors.isNotType("price",inputs.price,"number","item")
    if (isPriceNumber)
    {
      return next(isPriceNumber)
    }
      const item = await prisma.item.update({
        where: { id },
        data:  inputs ,
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