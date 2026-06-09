import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setCart, setLoading, setError } from "../store/features/cartSlice";
import * as CartApi from "../api/CartApi";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, loading } = useSelector(
    (state) => state.cart
  );
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      dispatch(setLoading(true));
      const response = await CartApi.getCart();
      dispatch(setCart(response.cart));
    } catch {
      dispatch(setError("Failed to load cart"));
      toast.error("Failed to load cart");
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      dispatch(setLoading(true));
      const response = await CartApi.updateCartItem(productId, newQuantity);
      dispatch(setCart(response.cart));
      toast.success("Cart updated");
    } catch {
      toast.error("Failed to update cart");
      dispatch(setError("Failed to update cart"));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      dispatch(setLoading(true));
      const response = await CartApi.removeFromCart(productId);
      dispatch(setCart(response.cart));
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
      dispatch(setError("Failed to remove item"));
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      dispatch(setLoading(true));
      const response = await CartApi.clearCart();
      dispatch(setCart(response.cart));
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
      dispatch(setError("Failed to clear cart"));
    }
  };

  const handleCheckout = () => {
    // Navigate to payment/checkout page
    navigate("/checkout");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Please login to view your cart
          </h2>
          <button
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Shopping Cart
          </h1>
          <p className="text-slate-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-600 mb-8">
              Add some products to get started
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Cart Items
                  </h2>
                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <div key={item.product._id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-800 truncate">
                            {item.product.title}
                          </h3>
                          <p className="text-slate-600 text-sm mt-1">
                            ₹{item.product.price.amount}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            Stock: {item.product.stock}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={loading || item.quantity <= 1}
                            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4 text-slate-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 12H4"
                              ></path>
                            </svg>
                          </button>

                          <span className="w-12 text-center font-semibold text-slate-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              loading || item.quantity >= item.product.stock
                            }
                            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4 text-slate-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              ></path>
                            </svg>
                          </button>
                        </div>

                        {/* Item Total & Remove */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-slate-800">
                            ₹{item.product.price.amount * item.quantity}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 text-sm font-medium mt-2 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Items ({totalItems})</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-slate-800">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors mt-6"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-colors mt-3"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
