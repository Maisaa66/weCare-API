const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripeMiddleware = require("../Middlewares/stripe.middleware");

require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: "Service Fee",
          },
          unit_amount: req.body.requestDetails.reqData.hourlyRate * 100,
        },
        quantity: req.body.requestDetails.reqData.totalHrs,
      },
    ],
    mode: "payment",
    success_url: `https://wecare-pam6.onrender.com`,
    cancel_url: `https://wecare-pam6.onrender.com`,
  });

  res.send({ url: session.url });
});

module.exports = router;
