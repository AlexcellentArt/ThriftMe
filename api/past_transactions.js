const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
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
        console.log("aaaaaaaaaa")
      const id = +req.params.userId;
      const past_transaction = await prisma.past_Transactions.findMany({ where: {buyer_id:id} });
      past_transaction.concat(await prisma.past_Transactions.findMany({ where: {buyer_id:id} }))
      console.log(past_transaction)
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
    // // verify existence of participants
    // const buyer = await prisma.past_Transactions.findUnique({ where: { id } });
    // const seller = await prisma.past_Transactions.findUnique({ where: { id } });
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

// ### GENERIC ERROR ASSEMBLY FUNCTIONS

// These will likely be moved to their own file and exported later back here in refactor.
// I advise using them to avoid writing next({status:,message:}) over and over again for the same thing being checked and resulting in the same message.

// If you don't want to use them, then just replace them with an obj in the format of {status:,message:}

// Array => String formatters
function ifArrayFormatToString(arr,formatter=commaSplitEndWithAnd){
    if (!Array.isArray(arr)){return `${arr}`}
    if (arr.length === 1){return `${arr[0]}`}
    return formatter(arr)
}

function commaSplitEndWithAnd(arr){
    const last = arr.pop()
    let newStr = arr.join(", ")
    return newStr+", and "+last
}

// Generic not found error
function genericNotFoundError(lookedFor, withKey, value) {
  return {
    status: 404,
    message: `Could not find ${lookedFor} with ${withKey} ${value}.`,
  };
}

// generic missing data Error
function genericMissingDataError(missingValues, forWhat = "input") {
    missingValues = ifArrayFormatToString(missingValues);
  return { status: 400, message: `${forWhat} is missing ${missingValues}.` };
}
function genericViolationDataError(values, violation, forWhat = "input") {
    missingValues = ifArrayFormatToString(values);
    return { status: 400, message: `${forWhat}'s ${values} is too ${violation}.` };
  }
function hasMissingInputs(object,mandatoryKeys, forWhat = "input") {
    const missing = []
    mandatoryKeys.forEach((key)=>{if (!object[key]){missing.push(key)}})
    if (missing.length){return genericMissingDataError(missing,forWhat);}
  }

function hasLengthViolations(object,settings={min:1,max:undefined}, forWhat = "input") {
    const violation = []
    // min
    if (settings.min){checkKeys.forEach((key)=>{if (object[key] < settings.min){violation.push(key)}})}
    if (violation.length){return genericViolationDataError(forWhat,violation,input)}
    // max
    if (settings.max){checkKeys.forEach((key)=>{if (object[key] > settings.max){violation.push(key)}})}
    if (violation.length){return genericViolationDataError(forWhat,violation,input)}
  }
// Returns null if unique, otherwise an error message
async function isNotUnique(table, key, value) {
  const alreadyUsed = await prisma[table].findUnique({ where: { key } });
  if (alreadyUsed) {
    return {
      status: 422,
      message: `Another ${lookedFor} is using ${value} as a ${key}.`,
    };
  }
  return null;
}
