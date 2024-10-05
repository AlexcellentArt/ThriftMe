const router = require("express").Router();
module.exports = router;
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");

const { tr } = require("@faker-js/faker");
const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js");
const bcrypt = require("bcrypt");

// ### GET ###

// Gets all credit_Card
router.get("/api/credit_cards", async (req, res, next) => {
  try {
    const credit_Card = await prisma.credit_Card.findMany();
    res.json(credit_Card);
  } catch (error) {
    next(error);
  }
});
// Returns credit_Card matching id
router.get("/api/credit_cards/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const credit_Card = await prisma.credit_Card.findUnique({
      where: { id },
    });
    if (!credit_Card) {
      return next(gen_errors.genericNotFoundError("credit_Card", "id", id));
    }
    res.json(credit_Card);
  } catch (error) {
    next(error);
  }
});
// ### POST ###

router.post("/api/credit_cards", async (req, res, next) => {
  try {
    // encryption
    const salt = await bcrypt.genSalt(13);
    const inputs = ({ user_id, pin, cvc, exp_date } = await req.body);
    // const isPin16 = gen_errors.hasLengthViolations(inputs, ["pin"], {
    //   min: 16,
    //   max: 17,
    // });
    // if (isPin16) {
    //   return next(isPin16);
    // }
    // salt credit card
    inputs.pin = await bcrypt.hash(inputs.pin, salt);
    const credit_Card = await prisma.credit_Card.create({ data: inputs });
    res.json(credit_Card);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###

// Updates credit_Card
router.put("/api/credit_cards/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.credit_Card.findUnique({ where: { id },include:{user:true}});
    if (!exists) {
      return next(gen_errors.genericNotFoundError("credit_Card", "id", id));
    }
    const inputs = ({ user_id, pin, cvc, exp_date } = await req.body);
    const isMissingInputs = gen_errors.hasMissingInputs(inputs, [
      "user_id",
      "pin",
      "exp_date",
    ]);
    if (isMissingInputs) {
      return next(isMissingInputs);
    }
    // const isPin16 = gen_errors.hasLengthViolations(inputs, ["pin"], {
    //   min: 16,
    //   max: 17,
    // });
    // if (isPin16) {
    //   return next(isPin16);
    // }
    // check if pin being changed:
    if (!bcrypt.compareSync(inputs.pin, exists.pin)) {
      // if so, encrypt new pin
      const salt = await bcrypt.genSalt(13);
      inputs.pin = await bcrypt.hash(inputs.pin, salt);
    }
    // check if being set as default
    if (inputs.is_default != exists.is_default){
      // if so, make sure no others are set as such
      const current = await prisma.credit_Card.findFirst({
        where: { user_id:exists.user_id, is_default:true },
      });
      console.log(current)
      if (current)
      {
        current["is_default"] = false;
        await prisma.credit_Card.update({
          where: { id:current.id },
          data: current,
        });
      }
    }
    const credit_Card = await prisma.credit_Card.update({
      where: { id },
      data: inputs,
    });
    res.json(credit_Card);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes credit_Card matching id
router.delete("/api/credit_cards/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.credit_Card.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("credit_Card", "id", id));
    }
    await prisma.credit_Card.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
