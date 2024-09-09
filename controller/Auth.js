const CustomError = require("../utils/CustomeError");
const apiResponse = require("../utils/APIResponse");
const { User } = require("../model/User");
const cookieOptions = require("../config/cookie.config");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    if (user) {
      res
        .status(201)
        .json(apiResponse(true, "User created successfully"));
    } else {
      res.status(400).json(apiResponse(false, "User not created"));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new CustomError(400, "All fields are required"));
  }
console.log(email,password);

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new CustomError(400, "Email or password does not match"));
    }

    const token = await user.generateJWTToken();

    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res
      .status(200)
      .json(apiResponse(true, "User logged in successfully", token));
  } catch (error) {
    next(new CustomError(500, error.message));
  }
};
