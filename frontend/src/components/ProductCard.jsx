import { useNavigate } from "react-router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart as addToCartAction,
  setLoading,
} from "../store/features/cartSlice";
import * as CartApi from "../api/CartApi";
import { toast } from "react-toastify";

function ProductCard({ id, title, description, images, price, stock }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.cart);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    if (typeof price === "object" && price.amount) {
      return `₹${price.amount.toLocaleString("en-IN")}`;
    }
    return `₹${price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"}`;
  };

  const truncateTitle = (text, maxLength = 50) => {
    if (!text) return "Untitled Product";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return "No description available";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation

    if (!isLoggedIn) {
      toast.info("Please login to add items to cart");
      navigate("/auth");
      return;
    }

    if (stock === 0) return;

    try {
      setIsAddingToCart(true);
      dispatch(setLoading(true));

      const response = await CartApi.addToCart(id, 1);
      dispatch(
        addToCartAction({
          product: { _id: id, title, price, images, stock },
          quantity: 1,
        })
      );

      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        {!imageError && images ? (
          <img
            src={images}
            alt={title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full shadow-lg border border-gray-200">
            <span className="text-sm font-bold">{formatPrice(price)}</span>
          </div>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-4 left-4">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
              stock > 0
                ? "bg-emerald-500/90 text-white shadow-emerald-500/25"
                : "bg-red-500/90 text-white shadow-red-500/25"
            } shadow-lg`}
          >
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </div>
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 leading-tight">
          {truncateTitle(title)}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
          {truncateDescription(description)}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Add to Cart Button */}
          {stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95 flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1-5m1.1 5l1.1 5M9 21h6m-6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          )}

          {/* View Details Button */}
          <button
            onClick={() => navigate(`/product-detail/${id}`)}
            className="w-full py-2.5 px-4 bg-white border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            View Details
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle Border Animation */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
          isHovered ? "border-blue-200 shadow-lg" : "border-transparent"
        }`}
      ></div>
    </div>
  );
}

export default ProductCard;
