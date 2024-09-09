const { Cart } = require("../model/Cart");
const apiResponse = require("../utils/APIResponse");
const CustomError = require("../utils/CustomeError");

exports.fetchCartByUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const cart = await Cart.find({ user: id }).populate("product");
    if (!cart) {
      res.status(404).json(apiResponse(false, "cart not found"));
    } else {
      res
        .status(200)
        .json(apiResponse(true, "Cart fetched successfully", cart));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.addToCart = async (req, res, next) => {
    const id = req.user.id;
  try {
    const cart = new Cart({...req.body,user:id  });
    const newCart = await cart.save();
    if (!newCart) {
      res.status(404).json(apiResponse(false, "Cart not created"));
    } else {
      const result = await newCart.populate("product");
      res
        .status(200)
        .json(apiResponse(true, "cart create successfully", result));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.deleteFromCart = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      res.status(404).json(apiResponse(false, "cart not found"));
    } else {
      res.status(200).json(apiResponse(true, "cart delete successfully", cart));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.updateCart = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!cart) {
      res.status(404).json(apiResponse(false, "cart not found"));
    } else {
      const newcart = await cart.populate("product");
      res
        .status(200)
        .json(apiResponse(true, "cart update successfully", newcart));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};
