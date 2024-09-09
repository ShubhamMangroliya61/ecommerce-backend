const { Brand } = require("../model/Brand");
const apiResponse = require("../utils/APIResponse");
const CustomError = require("../utils/CustomeError");

exports.fetchBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({}).exec();
    if (brands.length > 0) {
      res
        .status(200)
        .json(apiResponse(true, "Brands retrieved successfully", brands));
    } else {
      res.status(404).json(apiResponse(false, "No brands found"));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};

exports.createBrand = async (req, res, next) => {
  try {
    const newBrand = new Brand(req.body);
    const brand = await newBrand.save();
    if (brand) {
      res
        .status(201)
        .json(apiResponse(true, "Brand created successfully", brand));
    } else {
      res.status(400).json(apiResponse(false, "Brand not created"));
    }
  } catch (err) {
    next(new CustomError(500, err.message));
  }
};
