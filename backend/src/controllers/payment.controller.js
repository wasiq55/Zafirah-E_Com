const paymentModel = require("../models/payment.model");
const razorpayInstance = require("../services/payment.service");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const { amount, currency, user_id, product_id } = req.body;

    // Validate amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_${Date.now() * Math.random()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order)
      return res.status(400).json({ message: "Order generation failed" });

    const payment = await paymentModel.create({
      amount: amount,
      currency: currency,
      order_id: order.id,
      product_id,
      user: user_id,
    });

    return res.status(201).json({
      message: "order created successfully",
      order: payment,
      razorpay_key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Correct string format for signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Use Razorpay secret key from env
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      await paymentModel.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
          status: "Success",
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
        }
      );
      return res.status(200).json({ message: "Payment Verification Successful" });
    } else {
      await paymentModel.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
          status: "Failed",
          payment_id: razorpay_payment_id,
        }
      );
      return res.status(400).json({
        message: "Payment Verification Failed"
      });
    }
  } catch (error) {
    console.log("Error :", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {createOrder, verifyPayment};