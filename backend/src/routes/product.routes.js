const express = require("express");
const productController = require("../controllers/product.controller");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/create-product",
  authMiddleware.authSeller,
  upload.array("images", 5),
  productController.createProduct
);

/* GET seller */
router.get("/seller-products",authMiddleware.authSeller, productController.getSellerProducts);
router.get("/all-products", productController.getAllProducts);
router.get('/product-detail/:id',productController.getProductDetails);



module.exports = router;
