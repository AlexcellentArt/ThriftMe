const express = require("express");
const Stripe = require("stripe");
const { resolve } = require("path");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

//router to handle API route
const router = express.Router();

app.get("/success", async (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/success.html");
  res.sendFile(path);
});
