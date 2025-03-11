import React, { useState, useEffect } from "react";
import {
  FiCopy,
  FiEye,
  FiEyeOff,
  FiLock,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiKey,
} from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

import axiosInstance from "../auth/axios";

const AccountSettings = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [otpPopUp, setOtpPopUp] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const userId = sessionStorage.getItem("id");
  const [paying,setPaying] = useState(false)
  const [popup, setpopup] = useState(false);

  useEffect(() => {
    // if (!userId || employeeData) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}/dashboard`);
        // console.log(response)
        if (response.data.message === "Subscription inactive. Please renew.") {
          setpopup(true)
          setSubscriptionStatus({
            active: false,
            userName: response.data.userName,
            businessName: response.data.businessName,
          });
        } else {
          setEmployeeData(response.data.userDetails);
          setSubscriptionStatus({ active: true });
          setpopup(false)
        }
        // console.log(response.data)
        // setEmployeeData(response.data.userDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const renewSubscription = async () => {
    setPaying(true)
    try {
      const response = await axiosInstance.post("/renew-subscription", {
        user_id: userId, // Replace with actual user ID
      });

      if (response.status === 200) {
        // console.log(response.data.order.id);
        // console.log(response.data.order.amount);

        const options = {
          key: "rzp_live_R4krQLCHamePO8", // Use env variable
          amount: response.data.order.amount,
          currency: "INR",
          order_id: response.data.order.id,
          handler: function (response) {
            // console.log("Payment Successful:", response);
            window.location.reload();
          },
          prefill: {
            name: "John Doe",
            email: "john@example.com",
            contact: "9876543210",
          },
          theme: { color: "#3399cc" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setPaying(false)
    }
  };

  useEffect(() => {
    if (formData.newPassword.length === 0) {
      setPasswordStrength("");
    } else if (formData.newPassword.length < 6) {
      setPasswordStrength("Weak");
    } else if (formData.newPassword.length < 10) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  }, [formData.newPassword]);

  const resetForm = () => {
    setFormData({
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength("");
    setPasswordError("");
    setSuccessMessage(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage(false);
    resetForm();

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!formData.otp) {
      setPasswordError("OTP is required");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email: employeeData.user.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      // console.log("Password change response:", response.data);

      if (response.data) {
        setSuccessMessage(true);
        // console.log("setSuccessMessage(true);")
        // Delay form reset and hiding the form to allow UI update
        setShowPasswordForm(true);
        setTimeout(() => {
          setShowPasswordForm(false);
          setSuccessMessage(false);
        }, 3000);
      } else {
        // console.log("setSuccessMessage(false);")
        setPasswordError(response.data.message || "Failed to change password");
      }
    } catch (err) {
      setSuccessMessage(false); // 🚨 Add this line
      console.error("Password change error:", err);
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    }

    // Keep the error message visible for a while
    setTimeout(() => setPasswordError(""), 5000);
  };

  const Otp = async () => {
    setOtpPopUp(false);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: employeeData.user.email,
      });

      // console.log("OTP Sent:", response.data); // Optional: Debugging
      if (response.data.success) {
        // Optional: Show a success message for OTP sent
        setPasswordError("OTP has been sent to your email");
      } else {
        setPasswordError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setPasswordError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full md:w-[40%] m-5 p-6 bg-red-50 rounded-xl text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">⚠️ Loading Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br mt-24 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div
            className="relative h-64 md:h-52"
            style={{
              backgroundImage: `url('https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/digiblue_pt_cover.jpeg?updatedAt=1741522515594')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute md:bottom-2 bottom-5 w-full p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end md:gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group"
                >
                  <img
                    src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/7ec47348-583e-4a7a-9655-493c6c3b7b95-removebg-preview.png?updatedAt=1741522515589"
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl transition-transform group-hover:scale-105"
                  />
                </motion.div>

                <div className="text-center sm:text-left text-white space-y-2 flex-1">
                  <h1 className="hidden md:block text-2xl sm:text-3xl font-bold drop-shadow-md">
                    Account Settings
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-100">
                    <FiUser className="w-5 h-5" />
                    <p className="text-lg sm:text-xl">
                      {employeeData?.user?.name || ""}{" "}
                      {/* Updated to user.name */}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-sm">
                    <div className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <FiMail className="w-4 h-4" />
                      {employeeData?.user?.email || ""}{" "}
                      {/* Updated to user.email */}
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <FiPhone className="w-4 h-4" />
                      {employeeData?.user?.phoneNumber || ""}{" "}
                      {/* Updated to user.phoneNumber */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      label: "Full Name",
                      value: employeeData?.user?.name || "", // Updated
                      icon: FiUser,
                    },
                    {
                      label: "Email",
                      value: employeeData?.user?.email || "", // Updated
                      icon: FiMail,
                    },
                    {
                      label: "Phone",
                      value: employeeData?.user?.phoneNumber || "", // Updated
                      icon: FiPhone,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <FiKey className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  Employment Details
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      label: "Staff ID",
                      value: `#${employeeData?.user_id || ""}`, // Updated to user_id
                    },
                    {
                      label: "Business Name",
                      value: employeeData?.user?.businessName || "", // New field
                    },
                    {
                      label: "Join Date",
                      value: employeeData?.createdAt
                        ? new Date(employeeData.createdAt)
                            .toISOString()
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")
                        : "",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="group relative flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-800">
                          {item.value}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(item.value.replace("#", ""))
                        }
                        className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2">
                    <FiLock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    Login Credentials
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Secure your account with strong authentication
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    if (!showPasswordForm) resetForm();
                  }}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 text-white rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto text-center ${
                    showPasswordForm
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {showPasswordForm ? "Close" : "Change Password"}
                </button>
              </div>

              <AnimatePresence>
                {showPasswordForm && (
                  <div>
                    {otpPopUp ? (
                      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 bg-gray-100 p-4 mt-5 border rounded-lg shadow-inner">
                        <span className="text-gray-700 font-medium text-center sm:text-left">
                          Send OTP for changing password for{" "}
                          <strong>{employeeData?.user?.email || ""}</strong>
                        </span>
                        <button
                          onClick={Otp}
                          className="px-4 py-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                        >
                          Send OTP
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 sm:mt-6 overflow-hidden"
                      >
                        <form
                          onSubmit={handlePasswordChange}
                          className="space-y-4 sm:space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="relative space-y-2">
                              <label className="text-sm text-gray-600 flex items-center gap-1">
                                <FiLock className="w-4 h-4" /> OTP
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCurrentPassword ? "text" : "password"
                                  }
                                  name="otp"
                                  value={formData.otp}
                                  onChange={handleInputChange}
                                  className="w-full p-2 pr-10 border rounded-lg outline-none"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                  {showCurrentPassword ? (
                                    <FiEyeOff className="w-5 h-5" />
                                  ) : (
                                    <FiEye className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="relative space-y-2">
                              <label className="text-sm text-gray-600 flex items-center gap-1">
                                <FiLock className="w-4 h-4" /> New Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                                  className="w-full p-2 pr-10 border rounded-lg outline-none"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                  {showNewPassword ? (
                                    <FiEyeOff className="w-5 h-5" />
                                  ) : (
                                    <FiEye className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="relative space-y-2">
                              <label className="text-sm text-gray-600 flex items-center gap-1">
                                <FiLock className="w-4 h-4" /> Confirm Password
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  className="w-full p-2 pr-10 border rounded-lg outline-none"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                  {showConfirmPassword ? (
                                    <FiEyeOff className="w-5 h-5" />
                                  ) : (
                                    <FiEye className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm text-gray-600">
                                Password Strength
                              </label>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    passwordStrength === "Weak"
                                      ? "bg-red-500 w-1/3"
                                      : passwordStrength === "Medium"
                                      ? "bg-yellow-500 w-2/3"
                                      : passwordStrength === "Strong"
                                      ? "bg-green-500 w-full"
                                      : "w-0"
                                  }`}
                                />
                              </div>
                              <p className="text-sm font-medium">
                                {passwordStrength && (
                                  <span
                                    className={`${
                                      passwordStrength === "Weak"
                                        ? "text-red-600"
                                        : passwordStrength === "Medium"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {passwordStrength} Password
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Updated Message Display with Correct Styling Priority */}
                          <AnimatePresence>
                            {passwordError &&
                              passwordError !==
                                "Password updated successfully" && (
                                <motion.div
                                  key={passwordError}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="p-3 sm:p-4 rounded-lg bg-red-50 text-red-700"
                                >
                                  <div className="flex items-center gap-2 text-sm sm:text-base">
                                    <FiLock className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <p>{passwordError}</p>
                                  </div>
                                </motion.div>
                              )}
                          </AnimatePresence>

                          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordForm(false);
                                resetForm();
                                setSuccessMessage(false); // Clear success message on cancel
                              }}
                              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                            >
                              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              Update Password
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </div>
                )}
                {successMessage && (
                  <div>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all">
                        <div className="flex flex-col items-center">
                          {/* Checkmark Icon */}
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-8 h-8 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>

                          {/* Success Message */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Password Changed!
                          </h3>
                          <p className="text-gray-600 text-center mb-4">
                            Your password has been updated successfully.
                          </p>

                          {/* Close Button */}
                          <button
                            onClick={() => setSuccessMessage(false)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {popup && (
      <div className="fixed inset-0 mt-20 flex justify-center items-center bg-black bg-opacity-50 z-30  ">
        <div className=" lg:max-w-sm  max-w-md  shadow-lg  text-center relative m-5  ">
          <div className="bg-white rounded-xl lg:px-8 px-5 py-6 ">
            <div className="flex justify-center  ">
              <div className="h-36  w-full">
                <img
                  src="https://ik.imagekit.io/69rzkdyiaw/Group%201171275600.png?updatedAt=1738852802860"
                  alt="CRM Renewal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-orange-600 font-semibold md:text-lg text-base flex justify-center items-center">
              Renew Your CRM <span className="ml-1">⏳</span>
            </h2>

            <p className="text-left text-gray-600 ">
              <span className="md:text-sm  text-xs font-semibold">
                {" "}
                Hi {subscriptionStatus?.userName || "n/a"} ;{" "}
              </span>
              <br />
              <span className="md:text-sm text-xs ">
                Your subscription for{" "}
                <span className="font-semibold">
                  {subscriptionStatus?.businessName || "n/a"}
                </span>{" "}
                has expired. Renew now to restore your service.{" "}
              </span>
            </p>

            <p className="text-left text-gray-600 md:text-sm text-xs mt-2">
              <span className="md:text-sm text-xs font-semibold">Thanks,</span>
              <br />
              Team LogicQR
            </p>

            <div className="bg-gray-50 border rounded-lg px-4 py-2 mt-2">
              <p className="text-2xl font-bold text-[#032068] ">
                <span className="md:text-sm text-xs">₹749 </span>
                <span className="md:text-sm text-xs font-normal text-gray-500">
                  / Half-Year Plan
                </span>
              </p>
              <div className="mt-2 text-left border rounded-lg px-3 py-1">
                <p className="font-semibold text-gray-700 md:text-base text-sm">
                  Featured Services
                </p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li className="flex items-center md:text-sm text-xs">
                    <span className="text-blue-500 mr-2">
                      <BsCheckLg />
                    </span>{" "}
                    Unlimited customer feedback collection.
                  </li>
                  <li className="flex items-center md:text-sm text-xs">
                    <span className="text-blue-500 mr-2">
                      <BsCheckLg />
                    </span>{" "}
                    Smart review filtering (positive, neutral, negative).
                  </li>
                  <li className="flex items-center md:text-sm text-xs">
                    <span className="text-blue-500 mr-2">
                      <BsCheckLg />
                    </span>{" "}
                    Auto-publish positive reviews to Google.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-3">
              {/* <button onClick={() => setIsOpen(false)} className="w-1/2 bg-gray-300 text-gray-700 font-semibold md:text-sm text-xs py-2 rounded-md mr-2">Go Back</button> */}
              <button
                className=" w-full bg-[#032068] text-white font-semibold py-2 md:text-sm text-xs rounded-md"
                onClick={renewSubscription}
              >
                {paying?'Loading...':'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
    </div>
  );
};

export default AccountSettings;
