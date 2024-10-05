const router = require("express").Router();
module.exports = router;
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js")

// ### GET ###
// api/item
// Gets all item
router.get("/", async (req, res, next) => {
    try {
      const item = await prisma.item.findMany();
      console.log("returned item,",item)
      res.json(item);
    } catch(error) {
        next(error);
        }
  });
  // Returns item matching id
  router.get("/api/item/:id", async (req, res, next) => {
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

router.post("/api/item", async (req, res, next) => {
    try {
      console.log("post")
      const inputs = {seller_id, name, price, description, default_photo, additional_photos, tags } = await req.body;
      if (!inputs.seller_id)
{      const token = await decodeToken(req.headers.authorization)
      inputs.seller_id = token.userId
      console.log("DECODED TOKEN",token.userId)
    }
      const missing = gen_errors.hasMissingInputs(inputs,["seller_id","name", "price", "description","default_photo", "additional_photos", "tags"],"item")
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
      const item = await prisma.item.create({ data: inputs });
      res.json(item);
    } catch (error) {
      next(error)
    }
  });


  // post search,and get returned filtered or otherwise
  router.post("/api/item/search", async (req, res, next) => {
    try {
      console.log("search request got")
      const query = await req.query
      const body = await req.body
      console.log(query)
      console.log("body",body)
      // search params
      let tags = undefined;
      let text_search = undefined;
      let seller_id = undefined;
      // try to get keys off query if they exist
      if (Object.keys(query).length !== 0)
      {console.log("has query content")
        try {
          if (query.text_search){text_search = query.text_search;}
          if (query.tags){tags = query.tags;}
          if(query.seller_id){seller_id = await query.seller_id;}
        } catch (error) {
          // return next(error)
        }
      }
      console.log("EXTREACTED",tags,text_search)
      // try to get keys off body if they exist && text_search and tags are not already filled. For safety reasons, seller will always be in the body
      if (Object.keys(body).length !== 0)
      {
        console.log("has body content")
          if (text_search === undefined || ''){text_search = await body.text_search;}
          if (tags === undefined){tags = await body.tags;}
          seller_id = await body.seller_id;
      }
      console.log("Building Search settings....")
      const search = {}
      console.log("EXTREACTED",tags,text_search)
      if(tags !== undefined){
        if (!Array.isArray(tags))
          {
            tags = [tags]
          }
        search["tags"]={
            hasSome: tags,
          }}
      if (text_search !== undefined){
        search["name"]={
        contains: text_search,
        mode: 'insensitive'
      }}
      if (seller_id){
        search["seller"]={
          id:Number(seller_id)
      }}
      // log search settings in very visible black bg in terminal for later checking
      console.log(gen_errors.wrapConsoleLog("=====VVV SEARCH SETTINGS VVV====="))
      console.table(search)
      console.log(gen_errors.wrapConsoleLog("=====^^^ SEARCH SETTINGS ^^^====="))
        // if no search settings, return all items
        if (Object(search).length === 0){
          console.log("returning all")
          const item = await prisma.item.findMany();
          return res.json(item);
          }
        const getFiltered = await prisma.item.findMany({
          where: search
        })
      // if get filtered is nothing, return empty array
      if (!getFiltered) {
        console.log(`No Matches found for filter of name: ${text_search} tags:${tags} seller_id:${seller_id}`)
        return res.json([])
      }
      console.log("found matching items,",getFiltered)
      return res.json(getFiltered);
    } catch(error) {
        next(error);
        }
  });
// ### PATCH ###
// router.patch("/"), async (req, res, next) => {
//   try {console.log("patch base reached")} catch(error){console.error(error)}}
router.patch("/api/item/:id"), async (req, res, next) => {
  console.log("reached patch")
  try {
    const id = +req.params.id;
    const body = await req.body
    // const {field} = await req.body
    /* */
    console.log("Patch Body", body)
    const item = await prisma.item.findUnique({ where: { id } });
    console.log("BEFORE PATCH:", item)
    Object.keys(body).forEach((key)=>{if (!body[key] === undefined||null){item[key] = body[key]}})
    const edited = await prisma.item.update({
      where: { id },
      data:  item ,
    });
    console.log("AFTER PATCH:",edited)
    res.json(edited);
  }
  catch(err){
    next(err)
  }
}
// ### PUT ###

  // Updates item
  router.put("/api/item/:id", async (req, res, next) => {
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
router.delete("/api/item/:id", async (req, res, next) => {

    try {
      const id = +req.params.id;
      const exists = await prisma.item.findUnique({ where: { id } });
      if (!exists) {
        return next(gen_errors.genericNotFoundError("item","id",id));
      }
      await prisma.item.delete({ where: { id } });
      console.log("IS DELETING")
      res.sendStatus(204);
    } catch(error) {
    next(error);
    }
  });