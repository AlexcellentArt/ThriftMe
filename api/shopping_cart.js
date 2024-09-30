const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
const {
  isLoggedIn,
  decodeToken,
} = require("./helpers/auth.js");

const gen_errors = require("./helpers/gen_errors.js")
// ### GET ###

// Gets all items in shopping cart
router.get("/", async (req, res, next) => {
  try {
    console.log("getting");
    const shopping_cart = await prisma.shopping_Cart.findMany();
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});
// Returns shopping_cart matching id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const shopping_cart = await prisma.shopping_Cart.findUnique({where: { id } });
    if (!shopping_cart) {
      return next(gen_errors.genericNotFoundError("shopping_cart", "id", id));
    }
    // check if shopping cart has user_id, if so does authorization match
    if (shopping_cart.user_id)
    {
try {
        const {authorization} = await req.headers
        if(!authorization)
        {
          throw "you have no authorization"
        }
        const decode = await decodeToken(authorization)
        if(decode.message){return next(decode)}
        "if is admin, then bypass these next checks"
        if (!decode.isAdmin)
        {
          if (!decode.userId){return "you have no token"}
          const id = decode.userId
          if (shopping_cart.user_id !== id){throw "you are not the cart owner"}
        }
} catch (error) {
  next({
    status: 403,
    message: `There is an error that suggests this shopping cart does not belong to you. Specifically, ${error}.`,
  });
}
    }
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});

// // Returns shopping_cart matching id
// router.get("/:userId/:id", async (req, res, next) => {
//   try {
//     const id = +req.params.id;
//     const userId = +req.params.userId;
//     const shopping_cart = await prisma.shopping_Cart.findUnique({where: { id } });
//     if (!shopping_cart) {
//       return next(gen_errors.genericNotFoundError("shopping_cart", "id", id));
//     }
//     if (shopping_cart.user_id === userId) {
//       res.json(shopping_cart);
//     } else
//       next({
//         status: 403,
//         message: `There is an error that suggests this shopping cart does not belong to you.`,
//       });
//   } catch (error) {
//     next(error);
//   }
// });
// Returns the only unique shopping cart that exist for a individual user

// ### POST ###

router.post("/", async (req, res, next) => {
  try {
    console.log("Made it to post");
    const body = { user_id, item_dict, total_cost } = await req.body;
    console.log(body);
    // const missing = gen_errors.hasMissingInputs(body, ["item_dict", "total_cost"]);
    // if (missing) {
    //   console.log(missing);
    //   next(missing);
    // }
    const shopping_cart = await prisma.shopping_Cart.create({ data: body });
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});
router.post("/guest", async (req, res, next) => {
  try {
    console.log("Made it to post for guest");
    const shopping_cart = await prisma.shopping_Cart.create({ data: {item_dict:{},total_cost:0} });
    console.log("made cart "+shopping_cart.id)
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###

// Updates shopping_cart
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.shopping_Cart.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("shopping_cart", "id", id));
    }
    const body = { user_id, item_dict, total_cost } = await req.body;
    // // verify existence of participants

    const shopping_cart = await prisma.shopping_Cart.update({
      where: { id },
      data: body,
    });
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes shopping_cart matching id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.shopping_Cart.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("shopping_cart", "id", id));
    }
    await prisma.shopping_Cart.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
