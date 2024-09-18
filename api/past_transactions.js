const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
import {hasMissingInputs,genericNotFoundError,hasMissingInputs} from "./helpers/gen_errors"
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
      return next(genericNotFoundError("past_transaction", "id", id));
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
        return next(genericNotFoundError("past_transaction", "id", id));
      }
      res.json(past_transaction);
    } catch (error) {
      next(error);
    }
  });
// ### POST ###

router.post("/", async (req, res, next) => {
  try {
    const body = {seller_id,buyer_id,item_dict,total_cost,tags} = await req.body;
    console.log(body)
    const missing = hasMissingInputs(body,["seller_id","buyer_id","item_dict","total_cost","tags"],"transaction")
    if (missing){
        console.log(missing)
        next(missing)
    }
    const past_transaction = await prisma.past_Transactions.create({ data: body });
    res.json(past_transaction);
  } catch (error) {
    next(error);
  }
});
// ### PATCH ###

// Updates past_transaction
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.past_Transactions.findUnique({ where: { id } });
    if (!exists) {
      return next(genericNotFoundError("past_transaction", "id", id));
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
      return next(genericNotFoundError("past_transaction", "id", id));
    }
    await prisma.past_Transactions.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});