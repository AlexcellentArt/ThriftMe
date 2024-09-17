const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
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
router.get("/:shopping_cart/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const userId = +req.params.userId;
    const buyerId= +req.params.buyerId;
    const sellerId= +req.params.sellerId;
    const item_dict = +req.params.item_dict;
    const shopping_cart = await prisma.shopping_Cart.findUnique({
      where: { id },
    });
    if (!shopping_cart) {
      return next(genericNotFoundError("shopping_cart", "id", id));
    }
    if (
      shopping_cart.buyerId === buyerId &&
      shopping_cart.sellerId === sellerId
    ) {
      res.json(shopping_cart);
    } else
      next({
        status: 403,
        message: `There is an error that is not permitting the items to be displayed in your shopping cart, try a different item please .`,
      });
  } catch (error) {
    next(error);
  }
});
// Returns transaction user was involved in as seller or buyer
router.get("/:shopping_cart/:id", async (req, res, next) => {
  try {
    console.log("aaaaaaaaaa");
    const id = +req.params.userId;
    const userId = +req.params.userId;
    const buyerId= +req.params.buyerId;
    const item_dict = +req.params.item_dict
    const shopping_cart = await prisma.shopping_Cart.findMany({
      where: { buyer_id: id },
    });
    shopping_cart.concat(
      await prisma.shopping_Cart.findMany({ where: { buyer_id: id } })
    );
    console.log(shopping_cart);
    if (!shopping_cart) {
      return next(genericNotFoundError("shopping_cart", "id", id));
    }
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});
// ### POST ###

router.post("/", async (req, res, next) => {
  try {
    const body = ({ seller_id, buyer_id, item_dict, total_cost, tags } =
      await req.body);
    console.log(body);
    const missing = hasMissingInputs(
      body,
      ["seller_id", "buyer_id", "item_dict", "total_cost", "tags", "item_dict"],
      "transaction"

    );
    if (missing) {
      console.log(missing);
      next(missing);
    }
    const shopping_cart = await prisma.shopping_Cart.create({ data: body });
    res.json(shopping_cart);
  } catch (error) {
    next(error);
  }
});
// ### PATCH ###

// Updates shopping_cart
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.shopping_Cart.findUnique({ where: { id } });
    if (!exists) {
      return next(genericNotFoundError("shopping_cart", "id", id));
    }
    const body = ({ seller_id, buyer_id, item_dict, total_cost, tags } =
      await req.body);
    // // verify existence of participants
    // const buyer = await prisma.shopping_Cart.findUnique({ where: { id } });
    // const seller = await prisma.shopping_Cart.findUnique({ where: { id } });
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
      return next(genericNotFoundError("shopping_cart", "id", id));
    }
    await prisma.shopping_Cart.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
