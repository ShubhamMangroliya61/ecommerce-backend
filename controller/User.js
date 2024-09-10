const { User } = require("../model/User");
const apiResponse = require("../utils/APIResponse");
const CustomError = require("../utils/CustomeError");

exports.fetchUserById = async (req, res,next) => {
  const id  = req.user.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json(apiResponse(false, "user not found"));
    } else {
      res.status(200).json(
        apiResponse(true, "user get successfully", {
          id: user.id,
          addresses: user.addresses,
          email: user.email,
          role: user.role,
        })
      );
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.updateUser = async (req, res,next) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      res.status(404).json(apiResponse(false, "user not found"));
    } else {
      res.status(200).json(apiResponse(true, "user update successfully", user));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};
