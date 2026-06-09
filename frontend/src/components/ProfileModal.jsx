import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { setUser } from "../store/features/authSlice";
import {
  addToCart as addToCartAction,
  setLoading,
} from "../store/features/cartSlice";
import * as CartApi from "../api/CartApi";
import { toast } from "react-toastify";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.fullname?.firstName || "",
    lastName: user?.fullname?.lastName || "",
  });
  const [addingToCart, setAddingToCart] = useState(null);

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      firstName: user?.fullname?.firstName || "",
      lastName: user?.fullname?.lastName || "",
    });
  }, [user]);

  useEffect(() => {
    if (isOpen && activeTab === "purchases") {
      fetchPurchases();
    }
  }, [isOpen, activeTab]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/user/purchases");
      setPurchases(response.data.purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        username: formData.username,
        fullname: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      };

      const response = await axiosInstance.put(
        "/auth/user/profile",
        updateData
      );
      dispatch(setUser(response.data.user));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCartFromHistory = async (productId, product) => {
    try {
      setAddingToCart(productId);
      dispatch(setLoading(true));

      await CartApi.addToCart(productId, 1);
      dispatch(
        addToCartAction({
          product: {
            _id: productId,
            title: product.title,
            price: product.price,
            images: product.images,
            stock: product.stock || 999, // Assume available if from history
          },
          quantity: 1,
        })
      );

      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(null);
      dispatch(setLoading(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100 bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === "profile"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === "purchases"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Purchase History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* User Info Display */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Current Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Email
                    </label>
                    <p className="text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">
                      {user?.email}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Role
                    </label>
                    <p className="text-slate-800 bg-slate-100 px-3 py-2 rounded-lg capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Update Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter username"
                    />
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "purchases" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Purchase History
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading purchases...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 text-slate-400 mx-auto mb-4"
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
                  <p className="text-slate-600">No purchases found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase._id}
                      className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-2">
                            {purchase.product_id?.title || "Product"}
                          </h4>
                          <p className="text-slate-600 text-sm mb-2">
                            {purchase.product_id?.description?.substring(
                              0,
                              100
                            )}
                            ...
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>Amount: ₹{purchase.amount}</span>
                              <span>
                                Status:{" "}
                                <span className="text-green-600 font-medium">
                                  {purchase.status}
                                </span>
                              </span>
                              <span>
                                Date:{" "}
                                {new Date(
                                  purchase.createdAt || Date.now()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleAddToCartFromHistory(
                                  purchase.product_id._id,
                                  purchase.product_id
                                )
                              }
                              disabled={
                                addingToCart === purchase.product_id._id
                              }
                              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-slate-400 transition-colors flex items-center gap-2 text-sm"
                            >
                              {addingToCart === purchase.product_id._id ? (
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
                          </div>
                        </div>
                        {purchase.product_id?.images?.[0] && (
                          <img
                            src={purchase.product_id.images[0]}
                            alt={purchase.product_id.title}
                            className="w-20 h-20 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
