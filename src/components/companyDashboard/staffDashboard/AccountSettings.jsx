import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../auth/axios";


const AccountSettings = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formData, setFormData] = useState({
        existingPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const id = sessionStorage.getItem("id")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/employees/${id}`
                );
                setEmployeeData(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
            existingPassword: "",
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

        try {
            const response = await axiosInstance.post(
                "/change-password",
                {
                    employeeEmail: employeeData.employeeEmail,
                    oldPassword: formData.existingPassword,
                    newPassword: formData.newPassword,
                }
            );

            // console.log("Password change response:", response.data); // Debugging

            if (response.data) {
                setSuccessMessage(true);
                // console.log("setSuccessMessage(true);")
                // Delay form reset and hiding the form to allow UI update
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

    if (loading)
        return (
            <div className="min-h-screen pl-16 md:pl-20 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200" />
                    <div className="h-4 bg-gray-200 rounded w-48" />
                    <div className="h-4 bg-gray-200 rounded w-64" />
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen pl-16 md:pl-20 flex items-center justify-center">
                <div className="max-w-md p-6 bg-red-50 rounded-xl text-red-600 text-center">
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
       <div >
        {/* <Nav/> */}
         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 md:py-6 lg:py-8 md:pr-6 lg:pr-8 pl-16 md:pl-24">
            <div className="max-w-7xl mx-auto bg-white md:rounded-2xl shadow-xl overflow-hidden">
                <div
                    className="relative h-64 md:h-52"
                    style={{
                        backgroundImage: `url('https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/digiblue_pt_cover.jpeg?updatedAt=1741522515594')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-opacity-50 bg-gradient-to-b from-black/30 to-transparent" />

                    <div className="absolute bottom-0 w-full p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
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
                                <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-md hidden lg:block">
                                    Account Settings
                                </h1>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-100">
                                    <FiUser className="w-5 h-5" />
                                    <p className="text-lg sm:text-xl">
                                        {employeeData.employeeName}
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-sm">
                                    <div className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                                        <FiMail className="w-4 h-4" />
                                        {employeeData.employeeEmail}
                                    </div>
                                    <div className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                                        <FiPhone className="w-4 h-4" />
                                        {employeeData.employeePhoneNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-2 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
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
                                        value: employeeData.employeeName,
                                        icon: FiUser,
                                    },
                                    {
                                        label: "Email",
                                        value: employeeData.employeeEmail,
                                        icon: FiMail,
                                    },
                                    {
                                        label: "Phone",
                                        value: employeeData.employeePhoneNumber,
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
                                    { label: "Staff ID", value: `#${employeeData.employee_id}` },
                                    { label: "Referral Code", value: employeeData.referralCode },
                                    {
                                        label: "Join Date",
                                        value: new Date(employeeData.createdAt)
                                            .toISOString()
                                            .split("T")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-"),
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
                                            className="text-gray-400 hover:text-blue-600 opacity-100 transition-opacity p-1"
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
                                className={`px-4 py-2 sm:px-5 sm:py-2.5 text-white rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto text-center ${showPasswordForm
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {showPasswordForm ? "Close" : "Change Password"}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showPasswordForm && (
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
                                                    <FiLock className="w-4 h-4" /> Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        name="existingPassword"
                                                        value={formData.existingPassword}
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
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
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
                                                        type={showConfirmPassword ? "text" : "password"}
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
                                                        className={`h-full transition-all duration-500 ${passwordStrength === "Weak"
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
                                                            className={`${passwordStrength === "Weak"
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
                                                passwordError !== "Password updated successfully" && (
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
                            {successMessage && (
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
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
       </div>
    );
};

export default AccountSettings;