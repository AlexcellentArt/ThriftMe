const express = require("express");
const Stripe = require("stripe");
const { resolve } = require("path");
const { log } = require("console");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// router to handle API route
const router = express.Router();

// for the confirmation payment page
app.use(express.static(process.env.STATIC_DIR));

// route for setupIntent - saving payment method without charging
app.post("/create-setup-intent", async (req, res) => {
  const { userId } = req.body;
  const customerId = userId;

  try {
    const setupIntent = await stripe.setupIntent.create({
      customer: customerId,
      payment_method_type: ["card"],
    });
    res.send(setupIntent);
  } catch (error) {
    console.log(`Error creating setupIntent:`, error);
    return res.sendStatus(500);
  }
});

// paymentIntent for immediate payment
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",

      payment_method_types: ["link", "card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.get("/payment/next", async (req, res) => {
  const intent = await stripe.paymentIntents.retrieve(
    req.query.payment_intent,
    {
      expand: ["payment_method"],
    }
  );
  const status = intent.status;

  res.redirect(`/success?payment_intent_client_secret=${intent.client_secret}`);
});

app.get("/success", async (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/success.html");
  res.sendFile(path);
});

app.post("/webhook", async (req, res) => {
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
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);
});

app.listen(3000, () =>
  console.log(`Node server listening at http://localhost:3000`)
);
