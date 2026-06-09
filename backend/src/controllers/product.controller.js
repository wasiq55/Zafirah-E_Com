const productModel = require("../models/product.model");
const { uploadFile } = require("../services/storage.service");

async function createProduct(req, res) {
  const { title, description, price, stock } = req.body;
  const files = await Promise.all(
    req.files.map(async function (file) {
      return await uploadFile(file.buffer);
    })
  );

  const seller = req.seller;

  const realPrice = JSON.parse(price);

  const product = await productModel.create({
    title,
    description,
    images: files.map((file) => file.url),
    price: {
      amount: realPrice.amount,
      currency: realPrice.currency,
    },
    seller: seller._id,
    stock: parseInt(stock),
  });

  return res.status(201).json({
    message: "Product created successfully!",
    product,
  });
}

async function getSellerProducts(req, res) {
  const seller = req.seller;

  const products = await productModel.find({
    seller: seller._id,
  });

  res.status(200).json({
    message: "Seller Products Fetched!",
    products,
  });
}

async function getAllProducts(req, res) {
  const { search, page = 1, limit = 20 } = req.query;

  let query = {};

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
  }

  const skip = (page - 1) * limit;

  const products = await productModel
    .find(query)
    .populate("seller", "username email fullname role")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await productModel.countDocuments(query);

  res.status(200).json({
    message: "Products fetched successfully",
    products,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

async function getProductDetails(req, res) {
  const productId = req.params.id;

  const product = await productModel.findOne({
    _id: productId,
  });

  res.status(200).json({
    message: "product details fetched successfully",
    product,
  });
}

module.exports = {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
};
