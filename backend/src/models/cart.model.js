const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update totals before saving
cartSchema.pre("save", async function (next) {
  try {
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of this.items) {
      totalItems += item.quantity;
      // We'll calculate price when fetching cart with populated products
    }

    this.totalItems = totalItems;
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
