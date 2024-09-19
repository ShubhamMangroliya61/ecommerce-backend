const { Cart } = require("../model/Cart");
const apiResponse = require("../utils/APIResponse");
const CustomError = require("../utils/CustomeError");

exports.fetchCartByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.find({ user: userId }).populate("product");
    if (cart.length === 0) {
      res.status(404).json(apiResponse(false, "Cart not found"));
    }
    res.status(200).json(apiResponse(true, "Cart fetched successfully", cart));
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.addToCart = async (req, res, next) => {
  const id = req.user.id;
  try {
    const cart = new Cart({
      quantity: req.body.quantity,
      product: req.body.productId,
      user: id,
    });
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
exports.resetCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json(apiResponse(false, "User ID is required"));
    }

    const result = await Cart.deleteMany({ user: userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json(apiResponse(false, "No carts found for this user"));
    }

    res.status(200).json(apiResponse(true, "Cart reset successfully"));
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.updateCart = async (req, res, next) => {
  const { id } = req.params;
  try {
    req.body.product = req.body.product.id;
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
