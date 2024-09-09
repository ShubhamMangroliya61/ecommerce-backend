const { Product } = require("../Model/Product");
const CustomError = require("../utils/CustomeError");
const apiResponse = require("../utils/APIResponse");

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    if (product) {
      res
        .status(201)
        .json(apiResponse(true, "Product created successfully", product));
    } else {
      res.status(400).json(apiResponse(false, "Product not created"));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.fetchAllProducts = async (req, res, next) => {
  try {
    let condition = {};

    if (!req.query.admin) {
      condition.deleted = { $ne: true };
    }

    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition);

    if (req.query.category) {
      const categories = req.query.category.split(',');
      query = query.where('category').in(categories);
      totalProductsQuery = totalProductsQuery.where('category').in(categories);
    }

    if (req.query.brand) {
      const brands = req.query.brand.split(',');
      query = query.where('brand').in(brands);
      totalProductsQuery = totalProductsQuery.where('brand').in(brands);
    }

    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalProducts = await totalProductsQuery.countDocuments().exec();

    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit, 10);
      const page = parseInt(req.query._page, 10);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const products = await query.exec();

    res.status(200).json(apiResponse(true, "Products fetched successfully", {
      products,
      totalProducts
    }));
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.fetchProductById = async (req, res,next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json(apiResponse(false, "Product not found"));
    } else {
      res
        .status(200)
        .json(apiResponse(true, "Product get successfully", product));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.updateProduct = async (req, res,next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) {
      res.status(404).json(apiResponse(false, "Product not found"));
    } else {
      res
        .status(200)
        .json(apiResponse(true, "Product update successfully", product));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};
