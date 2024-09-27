const router = require("express").Router();
module.exports = router;
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");

const prisma = require("../prisma");
const gen_errors = require("./helpers/gen_errors.js");
const bcrypt = require("bcrypt");

// ### GET ###

// Gets all credit_cards
router.get("/", async (req, res, next) => {
  try {
    const credit_cards = await prisma.credit_cards.findMany();
    res.json(credit_cards);
  } catch (error) {
    next(error);
  }
});
// Returns credit_cards matching id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const credit_cards = await prisma.credit_cards.findUnique({
      where: { id },
    });
    if (!credit_cards) {
      return next(gen_errors.genericNotFoundError("credit_cards", "id", id));
    }
    res.json(credit_cards);
  } catch (error) {
    next(error);
  }
});
// ### POST ###

router.post("/", async (req, res, next) => {
  try {
    // encryption
    const salt = await bcrypt.genSalt(13);
    const inputs = ({ user_id, pin, cvc, exp_date } = await req.body);
    const isPin16 = gen_errors.hasLengthViolations(inputs, ["zip"], {
      min: 16,
      max: 16,
    });
    if (isPin16) {
      return next(isPin16);
    }
    // salt credit card
    inputs.pin = await bcrypt.hash(inputs.pin, salt);
    const credit_cards = await prisma.credit_cards.create({ data: inputs });
    res.json(credit_cards);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###

// Updates credit_cards
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.credit_cards.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("credit_cards", "id", id));
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
    const isPin16 = gen_errors.hasLengthViolations(inputs, ["zip"], {
      min: 16,
      max: 16,
    });
    if (isPin16) {
      return next(isPin16);
    }
    // check if pin being changed:
    if (!bcrypt.compareSync(inputs.pin, exists.pin)) {
      // if so, encrypt new pin
      const salt = await bcrypt.genSalt(13);
      inputs.pin = await bcrypt.hash(inputs.pin, salt);
    }

    const credit_cards = await prisma.credit_cards.update({
      where: { id },
      data: inputs,
    });
    res.json(credit_cards);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes credit_cards matching id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.credit_cards.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("credit_cards", "id", id));
    }
    await prisma.credit_cards.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
