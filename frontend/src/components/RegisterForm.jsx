import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../config/axiosInstance";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { registerSeller } from "../api/SellerApis";
import { updateUserRole } from "../store/features/authSlice";
import { toast } from "react-toastify";

const roleOptions = [
  { value: "user", label: "User" },
  { value: "seller", label: "Seller" },
];

const RegisterForm = ({ setflag }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user, isLoggedIn} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const newObj = {
        username: data.username,
        email: data.email,
        fullname: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        password: data.password,
        role: data.role,
      };
      if(isLoggedIn){
        // For logged-in users, update their role
        const response = await axiosInstance.put("/auth/user/role", { role: data.role });
        console.log("role updated:", response.data);
        dispatch(updateUserRole(data.role));
        toast.success("Role updated successfully! You are now a seller.");
        navigate("/seller");
      }else{
        // For new users, create account
        if(data.role === "seller"){
          const res =await registerSeller(newObj);
          console.log("seller registered:-> ", res);
          toast.success("Seller account created successfully!");

        }else{
          const response = await axiosInstance.post("/auth/user/register", newObj);
        console.log(response.data);
        toast.success("User account created successfully!");
        }
        reset();
        navigate("/");
      }
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Registration failed! Please try again.");
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-16 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-20 h-20 bg-pink-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-24 left-12 w-28 h-28 bg-purple-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-8 w-36 h-36 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        <div className="relative z-10 text-center text-white px-8 lg:px-12">
          <div className="mb-12">
            {/* Logo */}
            <div className="w-28 h-28 mx-auto mb-8 bg-white/20 rounded-3xl backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            
            <h1 className="text-6xl font-black mb-6 text-white drop-shadow-lg">
              Join Cric<span className="text-pink-300">Cart</span>
            </h1>
            <p className="text-xl font-medium text-purple-100 leading-relaxed max-w-md mx-auto">
              Create your account and unlock amazing deals from thousands of trusted sellers worldwide.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mt-16">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">🛍️</div>
              <div className="text-lg font-bold text-white mb-1">Shop</div>
              <div className="text-sm font-semibold text-purple-200">Browse & Buy</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-lg font-bold text-white mb-1">Sell</div>
              <div className="text-sm font-semibold text-purple-200">Start Business</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-lg font-bold text-white mb-1">Secure</div>
              <div className="text-sm font-semibold text-purple-200">Protected</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-lg font-bold text-white mb-1">Fast</div>
              <div className="text-sm font-semibold text-purple-200">Quick Setup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-800">
              Join Cric<span className="text-purple-600">Cart</span>
            </h2>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 p-8 lg:p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black mb-3">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Create Account
                </span>
              </h1>
              <p className="text-slate-600 font-medium text-lg">
                Join thousands of happy customers today
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {/* Username Field */}
                <div className="group">
                  <label
                    className="block text-sm font-bold text-slate-700 mb-3"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      defaultValue={user?.username}
                      disabled={isLoggedIn}
                      className={`w-full px-5 py-4 ${isLoggedIn ? 'bg-gray-100 border-gray-300' : 'bg-slate-50 border-slate-200'} border-2 rounded-2xl ${!isLoggedIn ? 'focus:bg-white focus:border-purple-500 focus:outline-none' : ''} transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium text-lg`}
                      placeholder="Choose a unique username"
                      {...register("username", {
                        required: isLoggedIn ? false : "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters"
                        }
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                      <svg className={`w-6 h-6 ${isLoggedIn ? 'text-gray-400' : 'text-slate-400 group-focus-within:text-purple-500'} transition-colors duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.username && (
                    <div className="mt-3 flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-semibold">{errors.username.message}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label
                    className="block text-sm font-bold text-slate-700 mb-3"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      defaultValue={user?.email}
                      disabled={isLoggedIn}
                      className={`w-full px-5 py-4 ${isLoggedIn ? 'bg-gray-100 border-gray-300' : 'bg-slate-50 border-slate-200'} border-2 rounded-2xl ${!isLoggedIn ? 'focus:bg-white focus:border-purple-500 focus:outline-none' : ''} transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium text-lg`}
                      placeholder="Enter your email address"
                      {...register("email", {
                        required: isLoggedIn ? false : "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Please enter a valid email"
                        }
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                      <svg className={`w-6 h-6 ${isLoggedIn ? 'text-gray-400' : 'text-slate-400 group-focus-within:text-purple-500'} transition-colors duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <div className="mt-3 flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-semibold">{errors.email.message}</span>
                    </div>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label
                      className="block text-sm font-bold text-slate-700 mb-3"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      defaultValue={user?.fullname?.firstName}
                      disabled={isLoggedIn}
                      className={`w-full px-4 py-4 ${isLoggedIn ? 'bg-gray-100 border-gray-300' : 'bg-slate-50 border-slate-200'} border-2 rounded-2xl ${!isLoggedIn ? 'focus:bg-white focus:border-purple-500 focus:outline-none' : ''} transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium`}
                      placeholder="First name"
                      {...register("firstName", {
                        required: isLoggedIn ? false : "First name is required",
                      })}
                    />
                    {errors.firstName && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-semibold">{errors.firstName.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="group">
                    <label
                      className="block text-sm font-bold text-slate-700 mb-3"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      defaultValue={user?.fullname?.lastName}
                      disabled={isLoggedIn}
                      className={`w-full px-4 py-4 ${isLoggedIn ? 'bg-gray-100 border-gray-300' : 'bg-slate-50 border-slate-200'} border-2 rounded-2xl ${!isLoggedIn ? 'focus:bg-white focus:border-purple-500 focus:outline-none' : ''} transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium`}
                      placeholder="Last name"
                      {...register("lastName")}
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="group">
                  <label
                    className="block text-sm font-bold text-slate-700 mb-3"
                    htmlFor="role"
                  >
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 focus:outline-none transition-all duration-300 text-slate-800 font-medium text-lg appearance-none cursor-pointer"
                      {...register("role", { required: "Please select account type" })}
                    >
                      <option value="">Choose account type</option>
                      {roleOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                      <svg className="w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.role && (
                    <div className="mt-3 flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-semibold">{errors.role.message}</span>
                    </div>
                  )}
                </div>

                {/* Password Field - hide for logged-in users */}
                {!isLoggedIn && (
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
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 focus:outline-none transition-all duration-300 text-slate-800 placeholder-slate-400 font-medium text-lg pr-14"
                      placeholder="Create a strong password"
                      {...register("password", {
                        required: isLoggedIn ? false : "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 hover:text-purple-500 transition-colors duration-200"
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
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-xl text-lg"
              >
                <span className="flex items-center justify-center">
                  {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLoggedIn ? "Updating Role..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLoggedIn ? "Update to Seller" : "Create Account"}
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </>
              )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-slate-600 font-medium text-lg">
                  Already have an account?{" "}
                  <button
                    onClick={() => setflag((prev) => !prev)}
                    className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300 underline decoration-2 underline-offset-2 decoration-pink-300 hover:decoration-pink-500"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-sm font-semibold text-slate-500 mb-4">🔒 Your information is safe and secure</p>
            <div className="flex justify-center items-center space-x-6">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md border border-slate-100">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-bold text-slate-700">SSL Encrypted</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md border border-slate-100">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-bold text-slate-700">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;