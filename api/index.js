const router = require("express").Router();
module.exports = router;

// /api
if ("./user".exists())
{
    router.use("/user", require("./user"));
}
if ("./item".exists())
{
    router.use("/item", require("./item"));
}

if ("./shopping_cart".exists())
{
    router.use("/shopping_cart", require("./shopping_cart"));
}

if ("./past_transactions".exists())
{
    router.use("/past_transactions", require("./past_transactions"));
}

if ("./checkout".exists())
{
    router.use("/checkout", require("./checkout"));
}
if ("./credit_card".exists())
{
    router.use("/credit_card", require("./credit_card"));
}
if ("./addresses".exists())
{
    router.use("/addresses", require("./addresses"));
}