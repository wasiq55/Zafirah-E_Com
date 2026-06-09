import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { removeUser } from "../store/features/authSlice";
import { axiosInstance } from "../config/axiosInstance";
import { toast } from "react-toastify";
import ProfileModal from "./ProfileModal";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiHeart,
  FiBell,
  FiLogOut,
  FiShoppingBag,
} from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const logoutUser = async () => {
    try {
      let res = await axiosInstance.get("/auth/user/logout");
      if (res) {
        toast.success("Logged out successfully!");
        return res.data.message;
      }
      console.log(res.data.message);
    } catch (error) {
      console.log("error in logout", error);
      toast.error("Logout failed! Please try again.");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(removeUser());
    navigate("/auth");
    closeMobileMenu();
  };

  const handleBecomeSeller = () => {
    if (!isLoggedIn) {
      toast.info("Please login to become a seller");
      navigate("/auth");
      closeMobileMenu();
    } else {
      // Show registration form for logged-in user to update role
      navigate("/auth", { state: { showRegister: true } });
      closeMobileMenu();
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1
              onClick={() => navigate("/")}
              className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            >
              𝒵𝒜𝐹𝐼𝑅𝒜𝐻
            </h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="relative">
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="Search products..."
                  type="search"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
            >
              <FiShoppingCart className="w-5 h-5 mr-2" />
              <span className="hidden lg:inline">Cart</span>
            </Link>

            {/* Auth Buttons */}
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                <FiUser className="w-4 h-4 mr-2" />
                Login
              </button>
            )}

            {/* Seller Button */}
            {user?.role === "seller" ? (
              <button
                onClick={() => navigate("/seller")}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                <FiShoppingBag className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Sell</span>
              </button>
            ) : (
              <button
                onClick={handleBecomeSeller}
                className="flex items-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg font-medium transition-all duration-200"
              >
                <FiShoppingBag className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Become Seller</span>
              </button>
            )}

            {/* Profile Button */}
            {user && (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center px-3 py-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all duration-200"
              >
                <FiUser className="w-5 h-5 mr-2" />
                <span className="hidden lg:inline">Profile</span>
              </button>
            )}

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <FiShoppingCart className="h-6 w-6" />
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
              placeholder="Search products..."
              type="search"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-3 bg-gradient-to-br from-slate-50 to-indigo-50 border-t-2 border-slate-200 rounded-b-3xl shadow-inner">
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-2xl shadow-md border border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {user?.username || "User"}
                  </p>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                </div>
              </div>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => {
                  navigate("/auth");
                  closeMobileMenu();
                }}
                className="w-full flex items-center px-5 py-4 text-left bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg"
              >
                <FiUser className="w-6 h-6 mr-4" />
                Sign In / Sign Up
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => {
                navigate("/wishlist");
                closeMobileMenu();
              }}
              className="w-full flex items-center px-5 py-4 text-left text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-2xl font-semibold transition-all duration-300 border-2 border-pink-200"
            >
              <FiHeart className="w-6 h-6 mr-4" />
              My Wishlist
              <div className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                2
              </div>
            </button>

            {user?.role === "seller" ? (
              <button
                onClick={() => {
                  navigate("/seller");
                  closeMobileMenu();
                }}
                className="w-full flex items-center px-5 py-4 text-left bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg"
              >
                <FiShoppingBag className="w-6 h-6 mr-4" />
                Seller Dashboard
              </button>
            ) : (
              <button
                onClick={handleBecomeSeller}
                className="w-full flex items-center px-5 py-4 text-left text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-300 border-2 border-emerald-200"
              >
                <FiShoppingBag className="w-6 h-6 mr-4" />
                Become a Seller
              </button>
            )}

            {/* Profile */}
            {user && (
              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  closeMobileMenu();
                }}
                className="w-full flex items-center px-5 py-4 text-left text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl font-semibold transition-all duration-300 border-2 border-slate-200"
              >
                <FiUser className="w-6 h-6 mr-4" />
                My Profile
              </button>
            )}

            {/* Notifications */}
            {user && (
              <button className="w-full flex items-center px-5 py-4 text-left text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl font-semibold transition-all duration-300 border-2 border-slate-200">
                <FiBell className="w-6 h-6 mr-4" />
                Notifications
                <div className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  3
                </div>
              </button>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-5 py-4 text-left bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg"
              >
                <FiLogOut className="w-6 h-6 mr-4" />
                Sign Out
              </button>
            )}

            {/* App Info */}
            <div className="px-4 py-3 mt-4 text-center border-t border-slate-300">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                ✨ Trusted by thousands
              </p>
              <div className="flex justify-center space-x-4 text-xs text-slate-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                  Secure
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  Fast
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-1"></div>
                  Loved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
