const express = require("express");
const {createOrder, verifyPayment} = require("../controllers/payment.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();


router.post("/create-order", authUser, createOrder);
router.post("/verify-payment", authUser, verifyPayment);

module.exports = router;