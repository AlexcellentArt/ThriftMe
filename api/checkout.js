const router = require("express").Router();
module.exports = router;
const prisma = require("../prisma");
// ### GET ###

// Gets all items in shopping cart
router.get("/", async (req, res, next) => {
  try {
    console.log("getting");
    const checkout = await prisma.checkout_Page.findMany();
    res.json(checkout);
  } catch (error) {
    next(error);
  }
});
// Returns checkout matching id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const userId = +req.params.userId;
    const buyerId = +req.params.buyerId;
    const sellerId = +req.params.sellerId;
    const item_dict = +req.params.item_dict;
    const checkout = await prisma.checkout_Page.findUnique({
      where: { id },
    });
    if (!checkout) {
      return next(genericNotFoundError("checkout", "id", id));
    }
    if (checkout.buyerId === buyerId && checkout.sellerId === sellerId) {
      res.json(checkout);
    } else
      next({
        status: 403,
        message: `There is an error that is not permitting the items to be displayed in your checkout cart, try again later .`,
      });
  } catch (error) {
    next(error);
  }
});
// Returns transaction user was involved in as seller or buyer
router.get(":id", async (req, res, next) => {
  try {
    console.log("aaaaaaaaaa");
    const id = +req.params.userId;
    const userId = +req.params.userId;
    const buyerId = +req.params.buyerId;
    const item_dict = +req.params.item_dict;
    const checkout = await prisma.checkout_Page.findMany({
      where: { buyer_id: id },
    });
    checkout.concat(
      await prisma.checkout_Page.findMany({ where: { buyer_id: id } })
    );
    console.log(checkout);
    if (!checkout) {
      return next(genericNotFoundError("checkout", "id", id));
    }
    res.json(checkout);
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
    const checkout = await prisma.checkout_Page.create({ data: body });
    res.json(checkout);
  } catch (error) {
    next(error);
  }
});
// ### PATCH ###

// Updates checkout
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.checkout_Page.findUnique({ where: { id } });
    if (!exists) {
      return next(genericNotFoundError("checkout", "id", id));
    }
    const body = ({ seller_id, buyer_id, item_dict, total_cost, tags } =
      await req.body);
    // // verify existence of participants
    // const buyer = await prisma.checkout_Page.findUnique({ where: { id } });
    // const seller = await prisma.checkout_Page.findUnique({ where: { id } });
    const checkout = await prisma.checkout_Page.update({
      where: { id },
      data: body,
    });
    res.json(checkout);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes checkout matching id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.checkout_Page.findUnique({ where: { id } });
    if (!exists) {
      return next(genericNotFoundError("checkout", "id", id));
    }
    await prisma.checkout_Page.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
