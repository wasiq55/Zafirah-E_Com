const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
  let totalItems = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    if (item.product && item.product.price) {
      totalItems += item.quantity;
      totalPrice += item.product.price.amount * item.quantity;
    }
  });

  return { totalItems, totalPrice };
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await cartModel.findOne({ user: userId }).populate({
      path: "items.product",
      select: "title price images stock",
    });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
      await cart.save();
    }

    const { totalItems, totalPrice } = calculateCartTotals(cart.items);

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error in getUserCart:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Check if product exists and is in stock
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;

      // Check stock again
      if (product.stock < cart.items[existingItemIndex].quantity) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity: quantity,
      });
    }

    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "title price images stock",
    });

    const { totalItems, totalPrice } = calculateCartTotals(cart.items);

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    if (quantity < 1) {
      return removeFromCart(req, res);
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // Check stock
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "title price images stock",
    });

    const { totalItems, totalPrice } = calculateCartTotals(cart.items);

    res.status(200).json({
      message: "Cart item updated successfully",
      cart: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "title price images stock",
    });

    const { totalItems, totalPrice } = calculateCartTotals(cart.items);

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOneAndUpdate(
      { user: userId },
      { items: [], totalItems: 0, totalPrice: 0 },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: {
        ...cart.toObject(),
        totalItems: 0,
        totalPrice: 0,
      },
    });
  } catch (error) {
    console.error("Error in clearCart:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
