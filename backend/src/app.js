const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const paymentRouter = require("./routes/payment.routes");
const cartRouter = require("./routes/cart.routes");

const app = express();

/* ---------------- CORS FIRST ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://zafirah-e-com-1.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ---------------- MIDDLEWARES ---------------- */

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zafirah Backend Running Successfully",
  });
});

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/cart", cartRouter);

/* ---------------- 404 HANDLER ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;