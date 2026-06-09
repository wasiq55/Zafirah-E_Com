import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/authSlice";
import { toast } from "react-toastify";

const LoginForm = ({ setflag }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Send data with both username and email fields
      const loginData = {
        username: data.emailOrUsername,
        email: data.emailOrUsername,
        password: data.password
      };
      
      const response = await axiosInstance.post("/auth/user/login", loginData, {
        withCredentials: true,
      });
      dispatch(setUser(response.data.user));
      console.log(response.data);
      toast.success("Login successful! Welcome back!");
      if (response.data.user.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed! Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-indigo-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        <div className="relative z-10 text-center text-white px-8 lg:px-12">
          <div className="mb-12">
            {/* Logo */}
            <div className="w-28 h-28 mx-auto mb-8 bg-white/20 rounded-3xl backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"></path>
              </svg>
            </div>
            
            <h1 className="text-6xl font-black mb-6 text-white drop-shadow-lg">
              Cric<span className="text-pink-300">Cart</span>
            </h1>
            <p className="text-xl font-medium text-indigo-100 leading-relaxed max-w-md mx-auto">
              Discover amazing products and enjoy seamless shopping experiences with thousands of satisfied customers.
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm font-semibold text-indigo-200">Products</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm font-semibold text-indigo-200">Customers</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-sm font-semibold text-indigo-200">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-800">
              Cric<span className="text-purple-600">Cart</span>
            </h2>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 p-8 lg:p-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black mb-3">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </h1>
              <p className="text-slate-600 font-medium text-lg">
                Sign in to continue your shopping journey
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Email/Username Field */}
                <div className="group">
                  <label
                    className="block text-sm font-bold text-slate-700 mb-3"
                    htmlFor="emailOrUsername"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                    <input
                      id="emailOrUsername"
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium text-lg"
                      placeholder="Enter email or username"
                      {...register("emailOrUsername", { 
                        required: "Email or username is required",
                        minLength: {
                          value: 3,
                          message: "Must be at least 3 characters"
                        }
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                      <svg className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.emailOrUsername && (
                    <div className="mt-3 flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-semibold">{errors.emailOrUsername.message}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="group">
                  <label
                    className="block text-sm font-bold text-slate-700 mb-3"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium text-lg pr-14"
                      placeholder="Enter your password"
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 hover:text-indigo-500 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-3 flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-semibold">{errors.password.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl text-lg"
              >
                <span className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <div className="text-center">
                <p className="text-slate-600 font-medium text-lg">
                  New to Cartify?{" "}
                  <button
                    onClick={() => setflag((prev) => !prev)}
                    className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 underline decoration-2 underline-offset-2 decoration-purple-300 hover:decoration-purple-500"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 text-center">
            <p className="text-sm font-semibold text-slate-500 mb-6">Trusted by thousands of users worldwide</p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md border border-slate-100">
                <svg className="w-6 h-6 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-bold text-slate-700">Secure</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md border border-slate-100">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm font-bold text-slate-700">Fast</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md border border-slate-100">
                <svg className="w-6 h-6 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-bold text-slate-700">Loved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;