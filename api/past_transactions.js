const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");

const gen_errors = require("./helpers/gen_errors.js")
// ### GET ###

// Gets all past_transactions
router.get("/", async (req, res, next) => {
  try {
    console.log("getting")
    const past_transaction = await prisma.past_Transactions.findMany();
    res.json(past_transaction);
  } catch (error) {
    next(error);
  }
});
// Returns past_transaction matching id
router.get("/:userId/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const userId = +req.params.userId
    const past_transaction = await prisma.past_Transactions.findUnique({ where: { id } });
    if (!past_transaction) {
      return next(gen_errors.genericNotFoundError("past_transaction", "id", id));
    }
    if (past_transaction.buyer_id === userId
        || past_transaction.seller_id === userId){res.json(past_transaction);}
    else(next({
        status: 403,
        message: `You were not involved in that transaction and cannot see it.`,
      }))
  } catch (error) {
    next(error);
  }
});
// Returns transaction user was involved in as seller or buyer
router.get("/:userId", async (req, res, next) => {
    try {
      const id = +req.params.userId;
      const past_transaction = await prisma.past_Transactions.findMany({ where: {buyer_id:id} });
      past_transaction.concat(await prisma.past_Transactions.findMany({ where: {seller_id:id} }))
      if (!past_transaction) {
        return next(gen_errors.genericNotFoundError("past_transaction", "id", id));
      }
      res.json(past_transaction);
    } catch (error) {
      next(error);
    }
  });

// router.get("/order", async (req, res, next) => {
//   try {
//     const id = +req.params.userId;
//     const past_transaction = await prisma.past_Transactions.findMany({ where: {buyer_id:id} });
//     past_transaction.concat(await prisma.past_Transactions.findMany({ where: {seller_id:id} }))
//     if (!past_transaction) {
//       return next(gen_errors.genericNotFoundError("past_transaction", "id", id));
//     }
//     res.json(past_transaction);
//   } catch (error) {
//     next(error);
//   }
// });
// ### POST ###

router.post("/", async (req, res, next) => {
  try {
    const body = {seller_id,buyer_id,item_dict,total_cost,tags} = await req.body;
    console.log(body)
    const missing = gen_errors.hasMissingInputs(body,["seller_id","buyer_id","item_dict","total_cost","shipping_address","paying_card","tags"],"transaction")
    if (missing){
        console.log(missing)
        return next(missing)
    }
    const past_transaction = await prisma.past_Transactions.create({ data: body });
    res.json(past_transaction);
  } catch (error) {
    next(error);
  }
});

router.post("/checkout", async (req, res, next) => {
  try {
    const body = {seller_id,buyer_id,item_dict,total_cost,tags} = await req.body;
    console.log(body)
    const missing = gen_errors.hasMissingInputs(body,["seller_id","buyer_id","item_dict","total_cost","shipping_address","paying_card","tags"],"transaction")
    if (missing){
        console.log(missing)
        return next(missing)
    }
    const past_transaction = await prisma.past_Transactions.create({ data: body });
    // get seller name
    const seller = prisma.user.findUnique({where:{id:body.seller_id}})
    // remove sensitive info and replace with names. tags not relevant to return.
    const censored = {seller_name:seller.name,item_dict:past_transaction.item_dict,total_cost:past_transaction.total_cost}
    res.json(censored);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###

// Updates past_transaction
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.past_Transactions.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("past_transaction", "id", id));
    }
    const body = {seller_id,buyer_id,item_dict,total_cost,tags} = await req.body;
    const past_transaction = await prisma.past_Transactions.update({
      where: { id },
      data: body,
    });
    res.json(past_transaction);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes past_transaction matching id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.past_Transactions.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("past_transaction", "id", id));
    }
    await prisma.past_Transactions.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});