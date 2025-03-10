import React, { useState, useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { FiMail, FiLock, FiX, FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../auth/axios";


function Login() {
  const carouselContent = [
    {
      image: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/photo-1454165804606-c3d57bc86b40_avif.heif?updatedAt=1741522515455",
      title: "Boost Online Visibility & Search Rankings",
      subtitle: "SEO-Optimized Business Solutions",
      description: "Improve search rankings using Filter negative reviews, highlight positive feedback, and improve SEO rankings with an automated dashboard that enhances your brand reputation.",
    },
    {
      image: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/photo-1556745757-8d76bdb6984b_avif.heif?updatedAt=1741522515441",
      title: "Smart Reputation Control",
      subtitle: "Automated Review Monitoring & Response",
      description: "Monitor and manage reviews in real time, suppress negative comments, and maintain a 5-star rating to build trust and boost search rankings.",
    },
    {
      image: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/photo-1552581234-26160f608093_avif.heif?updatedAt=1741522515434",
      title: "Customer-Driven Business Growth",
      subtitle: "Feedback Analytics & Service Optimization",
      description: "Use to filter and respond to reviews, suppress harmful content, and increase credibility, ensuring higher search rankings and customer confidence.",
    },
  ]

  // State management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselContent.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        {
          email,
          password,
        }
      );
      // console.log("Response",response)
      // console.log("jarooommu nee keta response daaa",response);
      sessionStorage.setItem("refreshToken", response.data.token.refreshToken);
      sessionStorage.setItem("accessToken", response.data.token.accessToken);
      sessionStorage.setItem("id", response.data.user_id);
      
      if (response.data.message === "Successfully logged in") {
        navigate(`/dashboard/${response.data.user_id}`);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login"
      );
    } finally{
      setLoading(false);
    }
    
  };

  // Forget password handlers
  const handleForgotPassword = () => {
    setIsOpen(true);
    setStep(1);
    setResetError("");
    setResetSuccess("");
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setStep(1);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setResetError("");
    setResetSuccess("");
  };

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (!email) {
      setResetError("Please enter your email address");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        { email }
      );
      // console.log(response);
      if (
        response.data.message === "User not found" ||
        response.data.message === " Employee not found"
      ) {
        setResetError(response.data.message);
      } else {
        setResetSuccess(
          response.data.message ||
            "OTP sent successfully! Please check your email."
        );
        setStep(2);
      }
    } catch (error) {
      setResetError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setResetError('')
    setResetSuccess('')
    
    if (!otp) {
      setResetError("Please enter the OTP");
      return;
    }

    if (!password || !confirmPassword) {
      setResetError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setResetError("Password must be at least 6 characters long");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      const response = await axiosInstance.post(
        "/auth/verify-otp",
        { email, otp,newPassword:password }
      )
      // console.log("Response",response.data.message)
      if(response.data.message==='Password successfully reset'){
      setResetSuccess("Password successfully Changed");
      setOtp(''),
      setPassword(''),
      setConfirmPassword(''),
      setTimeout(()=>{
        setIsOpen(false)
      },2000)
    } if(response.data.message==='Invalid code. Please try again.'){
      setResetError('Invalid code. Please try again')
    } if(response.data.message==='OTP has expired'){
      setResetError('OTP has expired')
    } if(response.data.message==='User not found'){
      setResetError('User not found')
    } 

    } catch (error) {
      // console.log(error)
      setResetError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  // Step 3: Reset Password
  // const handleResetPassword = async () => {
  //   if (!password || !confirmPassword) {
  //     setResetError("Please fill in all fields");
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setResetError("Passwords do not match");
  //     return;
  //   }

  //   if (password.length < 6) {
  //     setResetError("Password must be at least 6 characters long");
  //     return;
  //   }

  //   setResetLoading(true);
  //   setResetError("");

  //   try {
  //     const response = await axiosInstance.post(
  //       "/employees/verify-otp",
  //       {
  //         email,
  //         otp,
  //         password,
  //       }
  //     );
  //     setResetSuccess(response.data.message || "Password reset successful!");
  //     toast.success(
  //       "Password reset successful! Please login with your new password."
  //     );
  //     setTimeout(() => {
  //       handleCloseModal();
  //     }, 2000);
  //   } catch (error) {
  //     setResetError(
  //       error.response?.data?.message ||
  //         "Failed to reset password. Please try again."
  //     );
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };

  // Carousel navigation
  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselContent.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prev) =>
      prev === carouselContent.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:justify-center bg-white md:bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container mx-auto md:px-4 md:py-8">
        <div className="max-w-7xl mx-auto bg-white md:rounded-2xl md:shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
            {/* Carousel Section */}
            <div className="relative lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
              <div
                className="h-full w-full bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url(${carouselContent[currentSlide].image})`,
                }}
              >
                <div className="relative md:h-full flex flex-col justify-between p-8 h-80">
                  {/* Carousel Navigation */}
                  <div className="absolute hidden inset-0 md:flex items-center justify-between px-4">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                    >
                      <MdKeyboardArrowLeft className="text-3xl text-white" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                    >
                      <MdKeyboardArrowRight className="text-3xl text-white" />
                    </button>
                  </div>

                  {/* Carousel Content */}
                  <div className="relative md:pt-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-white md:mb-4 leading-tight">
                      {carouselContent[currentSlide].title}
                    </h2>
                    <p className="text-base md:text-lg text-white/90 mb-6">
                      {carouselContent[currentSlide].subtitle}
                    </p>
                  </div>

                  <div className="relative md:mb-10 text-center">
                    <p className="text-white/85 text-sm md:text-lg leading-relaxed mb-4 md:mb-8">
                      {carouselContent[currentSlide].description}
                    </p>
                    <div className="flex justify-center space-x-2">
                      {carouselContent.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                            currentSlide === index
                              ? "bg-white md:w-6 w-4"
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Section */}
            <div className="p-6 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-block mb-4 md:mb-6 transform hover:scale-105 transition-transform duration-300">
                    <div className="hidden w-16 h-16 md:w-20 md:h-20 bg-indigo-100 rounded-3xl md:flex items-center justify-center shadow-lg">
                      <img
                        src="https://ik.imagekit.io/psltlu4ds/Review/Produce-Ui.png?updatedAt=1736424836340"
                        alt="Logo"
                        className="w-10 h-10 md:w-12 md:h-12"
                      />
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Login
                  </h1>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-4 text-center md:mb-6 p-3 md:p-4 bg-red-50 rounded-lg">
                    <span className="text-red-600 text-sm">{errorMessage}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="text-right mt-2">
                      <button
                        type="button"
                        className="text-blue-500 text-sm hover:underline"
                        onClick={handleForgotPassword}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#313860] to-[#151928] text-white text-sm md:text-base py-3 px-6 rounded-lg transition-colors duration-300 font-medium"
                  >
                    {loading ? "Please Wait..." : "Continue"}
                  </button>
                </form>

                <div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-500 hover:underline"
                    >
                      Register Now
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Forget Password Modal */}
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 relative">
                  <button
                    onClick={handleCloseModal}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-5 h-5" />
                  </button>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-6">
                      {step === 1
                        ? "Forgot Password"
                        : step === 2
                        ? "Verify OTP"
                        : "Reset Password"}
                    </h2>

                    {(resetError || resetSuccess) && (
                      <div
                        className={`mb-4 p-3 rounded-lg ${
                          resetError ? "bg-red-50" : "bg-green-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <FiAlertCircle
                            className={`w-5 h-5 ${
                              resetError ? "text-red-500" : "text-green-500"
                            }`}
                          />
                          <p
                            className={`ml-2 text-sm ${
                              resetError ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {resetError || resetSuccess}
                          </p>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter your email"
                              disabled={resetLoading}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleRequestOTP}
                          disabled={resetLoading}
                          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400"
                        >
                          {resetLoading ? "Sending..." : "Send OTP"}
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Enter OTP
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter OTP"
                              disabled={resetLoading}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter new password"
                              disabled={resetLoading}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Confirm new password"
                              disabled={resetLoading}
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleVerifyOTP}
                          disabled={resetLoading}
                          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400"
                        >
                           {resetLoading ? "Resetting..." : "Reset Password"}
                        </button>
                      </div>
                    )}

                    {/* {step === 3 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter new password"
                              disabled={resetLoading}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Confirm new password"
                              disabled={resetLoading}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleResetPassword}
                          disabled={resetLoading}
                          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400"
                        >
                          {resetLoading ? "Resetting..." : "Reset Password"}
                        </button>
                      </div>
                    )} */}

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

