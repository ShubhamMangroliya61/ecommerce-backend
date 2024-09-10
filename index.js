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

server.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
server.use(cookieParser());
server.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3001');
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

server.use(errorMiddleware);
server.listen(PORT, () => {
  console.log("Server start");
});
