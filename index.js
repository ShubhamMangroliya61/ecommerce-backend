const express = require("express");
const mongoose = require("mongoose");
const server = express();
const cors = require("cors");
const config = require("./config/env.config");
const errorMiddleware = require("./middleware/error.middleware");
const PORT = config.get("port");
const isLogin = require("./middleware/auth.middleware");
const productsRoutes = require("./routes/Products");
const brandRoutes = require("./routes/Brands");
const categoriesRoutes = require("./routes/Categories");
const userRoutes = require("./routes/User");
const authRoutes = require("./routes/Auth");
const cartRoutes = require("./routes/Cart");
const orderRoutes = require("./routes/Order");
const cookieParser = require("cookie-parser");
const { Order } = require("./model/Order");

const endpointSecret = config.get("endpoint");
server.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
     console.log(event);
     
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded);
        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = 'received';
        await order.save();

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  }
);


server.use(
  cors({
    origin: config.get("frontendUrl"),
    credentials: true,
  })
);
server.use(cookieParser());
server.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", config.get("frontendUrl"));
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

server.use(express.json());

main().catch((err) => console.log(err));
async function main() {
  mongoose.connect(config.get("mongoUri"));
  console.log("database connected");
}

server.use("/products", isLogin.isLoggedIn, productsRoutes);
server.use("/brands", isLogin.isLoggedIn, brandRoutes);
server.use("/categories", isLogin.isLoggedIn, categoriesRoutes);
server.use("/users", isLogin.isLoggedIn, userRoutes);
server.use("/auth", authRoutes);
server.use("/cart", isLogin.isLoggedIn, cartRoutes);
server.use("/orders", isLogin.isLoggedIn, orderRoutes);

const stripe = require("stripe")(config.get("stripekey"));

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount,orderId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

server.use(errorMiddleware);

server.listen(PORT, () => {
  console.log("Server start");
});
