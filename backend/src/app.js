const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const paymentRouter = require("./routes/payment.routes");
const cartRouter = require("./routes/cart.routes");

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = ["http://localhost:5173", "https://criccart.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/cart", cartRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
