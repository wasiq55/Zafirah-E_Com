require("dotenv").config();

console.log("KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET);

const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;