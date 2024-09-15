const router = require("express").Router();
module.exports = router;
const fs = require('fs');

// massive check

// /api
if (fs.existsSync("./user"))
{
    router.use("/user", require("./user"));
}
else {
    console.log("user does not exist")
}
if (fs.existsSync("./item"))
{
    router.use("/item", require("./item"));
}

if (fs.existsSync("./shopping_cart"))
{
    router.use("/shopping_cart", require("./shopping_cart"));
}

if (fs.existsSync("./past_transactions"))
{
    router.use("/past_transactions", require("./past_transactions"));
}

if (fs.existsSync("./checkout"))
{
    router.use("/checkout", require("./checkout"));
}
if (fs.existsSync("./credit_card"))
{
    router.use("/credit_card", require("./credit_card"));
}
if (fs.existsSync("./addresses"))
{
    router.use("/addresses", require("./addresses"));
}