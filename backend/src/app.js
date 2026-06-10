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

// FIXED CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "https://zafirah-e-com-1.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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