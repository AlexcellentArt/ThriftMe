const express = require("express");
const Stripe = require("stripe");
const { resolve } = require("path");
require("dotenv").config();
// const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// app.use(express.json());
// router to handle API route
const router = require("express").Router();
module.exports = router;
// for the confirmation payment page
// app.use(express.static(process.env.STATIC_DIR));
// route for setupIntent - saving payment method without charging
router.post("/create-setup-intent", async (req, res) => {
  const { userId } = req.body;
  const customerId = userId;
  try {
    const setupIntent = await stripe.setupIntent.create({
      customer: customerId,
      payment_method_type: ["card"],
    });
    res.send(setupIntent);
  } catch (error) {
    console.error(`Error creating setupIntent:`, error);
    return res.sendStatus(500);
  }
});
//checkout stripe payment api
router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: [product.image],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error(`Error creating checkout session:`, error);
    return res.status(500).json({ error: error.message });
  }
});
// config endpoint to get publishable key
router.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
// route for webhook handler
router.post("/webhook", async (req, res) => {
  let data, eventType;
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.log(`:warning:  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }
  if (eventType === "payment_intent.succeeded") {
    console.log(":moneybag: Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log(":x: Payment failed.");
  }
  res.sendStatus(200);
});
router.get("/success", async (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/success.html");
  res.sendFile(path);
});
// app.listen(3000, () =>
//   console.log(`Node server listening at http://localhost:3000`)
// );