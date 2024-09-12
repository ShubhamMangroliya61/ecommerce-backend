const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { invoiceTemplate, sendMail } = require("../service/Common");
const apiResponse = require("../utils/APIResponse");
const CustomError = require("../utils/CustomeError");

exports.fetchOrdersByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const order = await Order.find({ user: userId });
    if (!order) {
      res.status(404).json(apiResponse(false, "order not found"));
    } else {
      res
        .status(200)
        .json(apiResponse(true, "Order fetched successfully", order));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.fetchAllOrders = async (req, res, next) => {
  try {
    let query = Order.find({});
    let totalProductsQuery = Order.find({});

    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }
    // const totalOrders = await totalProductsQuery.countDocuments().exec();

    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit, 10);
      const page = parseInt(req.query._page, 10);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const orders = await query.exec();

    res.status(200).json(
      apiResponse(true, "Orders fetched successfully", {
        orders,
        totalOrders,
      })
    );
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const order = new Order({ ...req.body });

    for (let item of order.items) {
      let product = await Product.findOne({ _id: item.product.id });
      product.$inc("stock", -1 * item.quantity);
      await product.save();
    }
    const newOrder = await order.save();
    if (!newOrder) {
      res.status(404).json(apiResponse(false, "Order not created"));
    } else {
        // const user = await User.findById(order.user);
        // sendMail({
        //   to: user.email,
        //   html: invoiceTemplate(order),
        //   subject: "Order Received",
        // });
      res
        .status(200)
        .json(apiResponse(true, "Order create successfully", newOrder));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      res.status(404).json(apiResponse(false, "order not found"));
    } else {
      res
        .status(200)
        .json(apiResponse(true, "order delete successfully", order));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.updateOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!order) {
      res.status(404).json(apiResponse(false, "order not found"));
    } else {
      res
        .status(200)
        .json(apiResponse(true, "order update successfully", order));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalOrders = await totalOrdersQuery.countDocuments().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const orders = await query.exec();
    res.status(200).json(
      apiResponse(true, "Orders fetched successfully", {
        orders,
        totalOrders,
      })
    );
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};
