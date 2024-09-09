const { Category } = require("../model/Category");
const apiResponse = require("../utils/APIResponse");
const CustomError = require("../utils/CustomeError");

exports.fetchCategories = async (req, res,next) => {
  try {
    const categories = await Category.find({}).exec();
    if (categories.length > 0) {
      res
        .status(200)
        .json(
          apiResponse(true, "categories retrieved successfully", categories)
        );
    } else {
      res.status(404).json(apiResponse(false, "No categories found"));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = new Category(req.body);
    const category = await newCategory.save();
    if (category) {
      res
        .status(201)
        .json(apiResponse(true, "Category created successfully", category));
    } else {
      res.status(400).json(apiResponse(false, "Category not created"));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};
