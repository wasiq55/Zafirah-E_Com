import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share,
  Shield,
  Truck,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { fetchProductDetail } from "../api/ProductApi";
import { createOrder } from "../api/PaymentAPI";
import { axiosInstance } from "../config/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await fetchProductDetail(id);
        setProduct(res);
      } catch (err) {
        console.error("Error in product detail:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const changeQuantity = (type) => {
    if (type === "inc" && quantity < product?.stock) setQuantity((q) => q + 1);
    if (type === "dec" && quantity > 1) setQuantity((q) => q - 1);
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return `${price.currency} ${price.amount.toLocaleString()}`;
  };

  // for payment handling
  const handlePayment = async () => {
    if (!user || !user._id) {
      alert("You must be logged in to make a payment.");
      return;
    }
    try {
      const orderData = {
        amount: product?.price?.amount,
        currency: product?.price?.currency,
        product_id: id,
        user_id: user._id,
      };

      let res = await createOrder(orderData);

      //creating order id
      let order_id = res.data.order.order_id;

      if (res) {
        const options = {
          key: res.data.razorpay_key,
          order_id: res.data.order.order_id,
          name: "CricCart E-comm app",
          description: "Product purchasing",
          amount: product?.price?.amount * 100, // Convert rupees to paise for Razorpay
          currency: product?.price?.currency,
          handler: async (response) => {
            let dets = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order_id,
            };
            let res = await axiosInstance.post("/payment/verify-payment", dets);
            if (res) {
              toast.success('Payment Successfull')
            } else {
              toast.error('Payment Failed')
            }
          },
          prefill: {
            name: "Puneet",
            contact: 9399336702,
            email: "puneet@gmail.com",
          },
          theme: {
            color: "blue",
          },
        };
        const rzps = new window.Razorpay(options);
        rzps.open();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Product not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Image Gallery */}
            <div className="p-6 flex flex-col items-center">
              <div className="aspect-square w-full max-w-md mb-4 rounded-xl overflow-hidden bg-gray-100 shadow">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === i
                          ? "border-blue-600 scale-105"
                          : "border-gray-200 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Stock */}
              <div className="mb-6 text-sm text-gray-700">
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => changeQuantity("dec")}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => changeQuantity("inc")}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total:{" "}
                    {formatPrice({
                      ...product.price,
                      amount: product.price.amount * quantity,
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-xl border ${
                    isWishlisted
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={
                      isWishlisted ? "w-5 h-5 fill-current" : "w-5 h-5"
                    }
                  />
                </button>
                <button className="p-3 rounded-xl border border-gray-300 hover:border-gray-400">
                  <Share className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
              >
                Buy Now
              </button>

              {/* Features */}
              <div className="mt-8 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Free delivery on orders above
                  ₹999
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" /> 30-day return policy
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> 2-year warranty included
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
