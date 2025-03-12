import React, { useState, useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiLock,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../auth/axios";
import axios from "axios";

function Register() {
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

  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successPopUp,setSuccessPopUp] = useState(false)
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    placeId: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [referralBox, setReferralBox] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselContent.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // console.log("jaromjery", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "email" ? value.toLowerCase() : value });
  };  

  const nextStep = () => {
    if (
      currentStep === 1 &&
      (!formData.fullName || !formData.email || !formData.phone)
    ) {
      setErrorMessage("Please fill in all fields to proceed.");
      return;
    }
    if (
      currentStep === 2 &&
      (!formData.businessName || !formData.businessType || !formData.placeId)
    ) {
      setErrorMessage("Please fill in all fields to proceed.");
      return;
    }
    setErrorMessage("");
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setErrorMessage("");
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleCheck = async () => {
    const email = formData.email;
    if (!email) {
      setErrorMessage("Please provide all fields");
      toast.error("fill the all the field!");
      return;
    }
  setLoading(true)
    try {
      const emailResponse = await axiosInstance.post(
        "/usercheck",
        { email }
      );
      // console.log(emailResponse)
      if (emailResponse.data.message === "Already a User") {
        setErrorMessage("Email Already Used");
      } else if (emailResponse.data.message === "You can register") {
        setErrorMessage("");
        nextStep();
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
    setLoading(false)
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");
    const {
      password,
      confirmPassword,
      fullName,
      phone,
      businessName,
      businessType,
      referralCode,
    } = formData;

    if (
      !fullName ||
      !phone ||
      !businessName ||
      !businessType ||
      !password ||
      !confirmPassword ||
      !referralCode
    ) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    // console.log(formData)

    try {


      const referralResponse = await axiosInstance.post("/referral-check", { referralCode });

        if (referralResponse.data.message === "Invalid referral code") {
            setErrorMessage("Invalid referral code. Please enter a valid one.");
            setLoading(false);
            return;
        }
        const { confirmPassword, ...filteredFormData } = formData;
        const response = await axiosInstance.post(
            "/create-order",
            filteredFormData
        );
    
        // console.log(response);
    
        if (response.status === 200) {
            // console.log(response.data.order.id);
            // console.log(response.data.order.amount);
    
            var options = {
                key: "rzp_live_R4krQLCHamePO8", // Use environment variables for security
                amount: response.data.order.amount,
                currency: "INR",
                order_id: response.data.order.id,
                handler: async function (paymentResponse) {
                  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentResponse;

                  if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
                      // console.log("Payment Successful:");
                      // console.log("Payment ID:", razorpay_payment_id);
                      // console.log("Order ID:", razorpay_order_id);
                      // console.log("Signature:", razorpay_signature);
                      setSuccessPopUp(true);
                      setErrorMessage("");
                  } else {
                      console.error("Payment verification failed. Invalid response:", paymentResponse);
                      setErrorMessage("Payment failed. Please try again.");
                  }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.contact 
                }
            };
    
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        }
    } catch (error) {
        console.error("Error during registration:", error);
        setErrorMessage("Failed to register. Please try again.");
    }
    setLoading(false);
}
    

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

  const { image, title, description } = carouselContent[currentSlide];

  return (
    <div className="min-h-screen flex flex-col md:justify-center bg-white md:bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container mx-auto md:px-4 md:py-8">
        <div className="max-w-7xl mx-auto bg-white md:rounded-2xl md:shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
            {/* Enhanced Carousel Section */}
            <div className="relative  lg:block">
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"
                aria-hidden="true"
              />
              <div
                className="h-full w-full bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url(${carouselContent[currentSlide].image})`,
                }}
              >
                <div className="relative md:h-full flex flex-col justify-between p-8 h-80">
                  {/* Carousel Navigation Buttons */}
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

            {/* Enhanced Registration Section */}
            <div className="p-6 lg:p-12 ">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-block mb-4 md:mb-6 transform hover:scale-105 transition-transform duration-300">
                    <div className=" hidden w-16 h-16 md:w-20 md:h-20 bg-indigo-100 rounded-3xl md:flex items-center justify-center shadow-lg">
                      <img
                        src="https://ik.imagekit.io/psltlu4ds/Review/Produce-Ui.png?updatedAt=1736424836340"
                        alt="Logo"
                        className="w-10 h-10 md:w-12 md:h-12"
                      />
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    {currentStep === 1 && "Get Started"}
                    {currentStep === 2 && "Business Details"}
                    {currentStep === 3 && "Secure Account"}
                  </h1>
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-gradient-to-r from-[#313860] to-[#151928] w-6 md:w-8"
                            : "bg-gray-200 w-4"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-4 text-center md:mb-6 p-3 md:p-4 bg-red-50 rounded-lg">
                    <span className="text-red-600 text-sm">{errorMessage}</span>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="+91 9098976900"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCheck}
                      className="w-full bg-gradient-to-r from-[#313860] to-[#151928] text-white text-sm md:text-base py-3 px-6 rounded-lg transition-colors duration-300 font-medium"
                    >
                      {loading ? "Please Wait..." : "Create Account"}
                    </button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                      </label>
                      <div className="relative">
                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                      </label>
                      <div className="relative">
                        <FaRegBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Retail"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Place ID
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="placeId"
                          value={formData.placeId}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter Google Place ID"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={prevStep}
                        className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm md:text-base py-3 px-6 rounded-lg transition-colors duration-300 font-medium"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="w-1/2 bg-gradient-to-r from-[#313860] to-[#151928] text-sm md:text-base text-white py-3 px-6 rounded-lg transition-colors duration-300 font-medium"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Source
                      </label>
                      <div className="relative">
                        <select
                          defaultValue={formData.referralCode} // Use defaultValue instead of value
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                              ...formData,
                              referralCode:
                                value === "Referred Person" ? "" : value,
                            });
                            setReferralBox(value === "Referred Person");
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                        >
                          <option value="">How Did You Hear About Us?</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Google">Google</option>
                          <option value="Referred Person">
                            Referred by Friends
                          </option>
                        </select>

                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    {referralBox && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Referral Code
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter referral code"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Create Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="••••••••"
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
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={prevStep}
                        disabled={loading}
                        className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-sm md:text-base transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        disabled={loading}
                        onClick={handleRegister}
                        className="w-1/2 bg-gradient-to-r from-[#313860] to-[#151928] text-white py-3 px-6 text-sm md:text-base rounded-lg transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center text-sm text-gray-600">
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {successPopUp && (
 <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
 <div className="bg-white p-8 rounded-xl shadow-xl w-[90%] max-w-md transition-all duration-200">
   <div className="flex flex-col items-center space-y-5">
     {/* Emoji Circle */}
     <div className="relative bg-green-500/10 w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-sm group hover:shadow-md transition-shadow">
  {/* Animated ping effect */}
  <div className="absolute inset-0 rounded-full bg-green-100 animate-ping" />
  
  {/* Checkmark container */}
  <div className="relative z-10 bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
    {/* Checkmark icon */}
    <svg 
      className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M5 13l4 4L19 7" 
      />
    </svg>
  </div>
</div>

     {/* Text Content */}
     <div className="text-center space-y-2">
       <h2 className="text-2xl font-semibold text-gray-800">
         Registration Successful
       </h2>
       <p className="text-gray-500 text-[15px] leading-relaxed">
         Your account has been successfully created.
       </p>
     </div>

     {/* Action Button */}
     <button
       onClick={() => navigate("/login")}
       className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-lg 
                hover:bg-blue-700 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 w-full text-sm font-medium
                flex items-center justify-center gap-2"
     >
       Continue to Login
       <svg
         xmlns="http://www.w3.org/2000/svg"
         className="h-4 w-4"
         viewBox="0 0 20 20"
         fill="currentColor"
       >
         <path
           fillRule="evenodd"
           d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
           clipRule="evenodd"
         />
       </svg>
     </button>
   </div>
 </div>
</div>
)}

    </div>
  );
}

export default Register;
