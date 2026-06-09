const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authUser } = require("../middlewares/auth.middleware");

// All cart routes require authentication
router.get("/", authUser, cartController.getUserCart);
router.post("/add", authUser, cartController.addToCart);
router.put("/update", authUser, cartController.updateCartItem);
router.delete("/remove", authUser, cartController.removeFromCart);
router.delete("/clear", authUser, cartController.clearCart);

module.exports = router;
