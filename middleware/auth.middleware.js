const jwt=require("jsonwebtoken")
const { User } = require("../model/User");
const CustomError = require("../utils/CustomeError");

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new CustomError(400, "Unauthenticated, please login again"));
  }
  const userDetail = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(userDetail.id);
  if (!user) {
    return next(new CustomError(404, "User not found"));
  }
  req.user = user;
  next();
};

module.exports = {isLoggedIn};
