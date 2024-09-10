const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
const CustomError = require("../utils/CustomeError");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

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
  } catch (error) {
    return next(new CustomError(401, "Invalid or expired token"));
  }
};

module.exports = { isLoggedIn };
