import { useState } from "react";
import { FaCheckCircle, FaMoneyBillWave, FaQrcode, FaRegComments, FaInfoCircle } from "react-icons/fa";
import { FaRegThumbsUp, FaRegThumbsDown, FaChevronUp, FaChevronDown, FaUser, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaIndustry } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BsGraphUp } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { CiExport } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import { BsXDiamondFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Footer from "./Footer";


export default function Document() {
  const [activeSection, setActiveSection] = useState("Get Started");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/"); // Change this to your desired route
  };


  const steps = [
    {
      imgSrc: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/reg%20Form1%20img?updatedAt=1741520723000",
      alt: "Registration Form",
      text: "Step 1: Enter Name, Email, and Phone Number",
    },
    {
      imgSrc: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Reg%20Form2?updatedAt=1741520799912",
      alt: "Payment Process",
      text: "Step 2: Business Name, Business Type, and Google Place ID",
    },
    {
      imgSrc: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/reg%20Form3%20img?updatedAt=1741520850093",
      alt: "Successful Registration",
      text: "Step 3: Referral (if any), Social Media, Set Password, Confirm Password",
    },
  ];

  return (
    <div>
      <Helmet>
        <link rel="canonical" href="https://www.logicqr.com/docs" />
        <title>LogicQR Documentation - Setup, Manage, and Track Feedback</title>
        <meta name="description" content="Explore LogicQR documentation to learn how to set up QR codes, manage feedback, and grow your business using customer insights." />
        <meta name="keywords" content="LogicQR Documentation, QR Code Setup, Feedback Management, Business Growth, Customer Insights, Track Feedback" />
      </Helmet>
      <div className=" bg-gray-100">
        <div className="min-h-screen container mx-auto pt-24 text-gray-800">
          <div className=" w-[90%] mx-auto">


            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-6">
              {/* Fixed Sidebar Navigation */}
              <div className="lg:col-span-1 col-span-4 block sticky top-20 bg-gray-100 pt-4 z-10 lg:top-0 h-auto lg:h-screen ">
                <div className=" mb-4">
                  {/* Mobile Dropdown Toggle */}
                  <div className="lg:hidden">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-blue-600 active:scale-95"
                    >
                      <span className="font-semibold tracking-wide">
                        {activeSection ? activeSection.replace("-", " ").toUpperCase() : "MENU"}
                      </span>
                      {isOpen ? (
                        <FaChevronUp className="text-white text-lg transition-transform duration-300" />
                      ) : (
                        <FaChevronDown className="text-white text-lg transition-transform duration-300" />
                      )}
                    </button>
                  </div>

                  {/* Sidebar List (Responsive) */}
                  <ul className={`space-y-4 mt-4 ${isOpen ? "block" : "hidden"} lg:block`}>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection("Get Started");
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-3 w-full rounded-lg transition-colors ${activeSection === "Get Started" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <FaCheckCircle /> Get Started
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection("registration");
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-3 w-full rounded-lg transition-colors ${activeSection === "registration" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <FaUserPlus /> Registration
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection("payment");
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-3 w-full rounded-lg transition-colors ${activeSection === "payment" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <FaMoneyBillWave /> Payment
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection("dashboard");
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-3 w-full rounded-lg transition-colors ${activeSection === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <MdOutlineDashboard /> Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection("qr-usage");
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-3 w-full rounded-lg transition-colors ${activeSection === "qr-usage" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <FaQrcode /> QR Code Usage
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveSection("support");
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-3 w-full rounded-lg transition-colors ${activeSection === "support" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        <BiSupport /> Support
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Scrollable Content Section */}
              <div className="md:col-span-3 overflow-auto max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] mb-8 bg-white rounded-lg">
                {activeSection === "Get Started" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:p-8 p-4"
                  >
                    {/* Header Section */}
                    <div className="flex items-center gap-4 mb-4 lg:mb-8">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FaQrcode className="text-blue-600 lg:text-5xl text-3xl" />
                      </motion.div>
                      <h2 className="lg:text-4xl text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Why Logic QR
                      </h2>
                    </div>

                    {/* Description Section */}
                    <p className="md:text-base text-sm text-gray-800 mb-8 leading-relaxed">
                      In today's competitive business world, <span className="font-bold">customer feedback</span> plays a crucial role in shaping a brand's reputation and driving growth. However, most businesses struggle to handle <span className="font-bold">negative feedback</span> and often miss opportunities for improvement. <span className="font-bold">LogicQR</span> is designed to bridge that gap by transforming <span className="font-bold">feedback into growth.</span>
                    </p>

                    {/* Features Section */}
                    <div className=" lg:p-8 p-4rounded-2xl mb-4 lg:mb-8">
                      <ul className="space-y-8">
                        {/* Positive Review Section */}
                        <li className="flex flex-col lg:flex-row items-center gap-8">
                          <div className="flex items-center gap-4 text-2xl font-semibold w-full">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <FaRegThumbsUp className="text-green-500 md:text-4xl text-2xl hover:text-green-600 transition-colors duration-300" />
                            </motion.div>
                            <span className="text-gray-800 bg-gradient-to-r from-green-100 to-green-50 px-4 text-base py-2 h-20 items-center flex w-full rounded-lg shadow-sm">
                              Positive Feedback Builds Reputation
                            </span>
                          </div>
                          <motion.div
                            className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img
                              src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Success%20img?updatedAt=1741521043582"
                              alt="Positive Review Animation"
                              className=" w-full h-[350px] object-cover"
                            />

                          </motion.div>
                        </li>

                        {/* Negative Review Section */}
                        <li className="flex flex-col lg:flex-row-reverse items-center gap-8">
                          <div className="flex items-center gap-4 text-2xl font-semibold w-full">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: -10 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <FaRegThumbsDown className="text-red-500 md:text-4xl text-2xl hover:text-red-600 transition-colors duration-300" />
                            </motion.div>
                            <span className="text-gray-800 bg-gradient-to-r lg:text-base text-sm from-red-100 to-red-50 h-20 px-4 py-2 rounded-lg items-center flex w-full shadow-sm">
                              Negative Feedback Improves Business
                            </span>
                          </div>
                          <motion.div
                            className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img
                              src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Dashboard%20img?updatedAt=1741521125672"
                              alt="Negative Review Management"
                              className="w-full object-cover"
                            />

                          </motion.div>
                        </li>
                      </ul>
                    </div>

                    {/* Call to Action Section */}
                    <p className="md:text-base text-sm text-gray-800 mb-8 leading-relaxed">
                      This guide will walk you through the registration process and help you manage your feedback, ensuring steady business growth. <span onClick={() => {
                        setActiveSection("registration");
                        window.scrollTo(0, 0);
                      }} className="text-blue-500 font-semibold cursor-pointer">Let's get started!</span>
                    </p>

                  </motion.div>
                )}

                {activeSection === "registration" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:p-8 p-4 rounded-2xl ">
                    <h2 className="md:text-3xl text-xl font-bold lg:mb-6 mb-3 text-gray-900">Registration Process</h2>
                    <p className="text-gray-600 mb-8 md:text-base text-sm leading-relaxed">To start using the system, businesses need to register by providing the following details:</p>

                    <div className="grid grid-cols-1 gap-8 mb-6 lg:mb-12">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 lg:p-10 p-3 lg:rounded-md lg:shadow-lg">
                        {/* Section Heading */}


                        {/* List Items with Icons */}
                        <div className="flex flex-col lg:flex-row items-center ">

                          <ul className="space-y-4 text-gray-700 text-lg w-full flex flex-col justify-between">
                            <h3 className="md:text-3xl text-xl text-blue-900 lg:mb-6 mb-3 flex items-center gap-2">

                              <span className="">
                                Required Information
                              </span>
                              <FaInfoCircle className=" md:text-3xl text-xl" />
                            </h3>
                            <li className="flex items-center gap-3 ">
                              <FaUser className="text-blue-600 " /> <span className="md:text-base text-sm">
                                Full Name of business owner or manager
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <FaEnvelope className="text-blue-600 " /> <span className="md:text-base text-sm">Email Address for login credentials</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <FaMapMarkerAlt className="text-blue-600 " /> <span className="md:text-base text-sm">Google Place ID (unique identifier)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <FaBuilding className="text-blue-600 " /> <span className="md:text-base text-sm">Business Name (store, restaurant, etc.)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <FaIndustry className="text-blue-600 " /> <span className="md:text-base text-sm">Business Type (retail, hospitality, service)</span>
                            </li>
                          </ul>
                          <div className=" flex w-full items-center justify-center">
                            <motion.img
                              src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Checklist%20img?updatedAt=1741520905995"
                              alt="Reg image"
                              className=" md:w-[400px] md:h-[350px] "
                              whileHover={{ scale: 1.05 }}
                            />
                          </div>
                        </div>

                        {/* Steps Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 lg:mt-16">
                          {steps.map((step, index) => (
                            <motion.div
                              key={index}
                              className="relative group overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              {/* Step Image */}
                              <img
                                src={step.imgSrc}
                                alt={step.alt}
                                className=" object-cover rounded-md transform group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Hover Overlay */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              >
                                <p className="text-white text-lg font-semibold text-center px-6">{step.text}</p>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>


                    <p className="text-gray-700 md:text-lg text-base mb-3 lg:mb-6">Once you successfully <span className="font-bold">register with LogicQR</span>, you will gain <span className="font-bold">immediate access</span> to your personalized dashboard, where you can <span className="font-bold">manage your feedback</span> and <span className="font-bold">download your unique QR code</span> to collect customer reviews.</p>



                    <div className="lg:mt-12 mt-4 lg:p-8 p-3 bg-gray-100 lg:rounded-2xl lg:shadow-md">
                      <h3 className="md:text-2xl text-lg font-bold lg:mb-6 mb-3 text-gray-900">How to Find Your Google Place ID</h3>
                      <p className="text-gray-700 md:text-lg text-base lg:mb-6 mb-3 leading-relaxed">Follow these steps to find your Google Place ID:</p>
                      <ol className="list-decimal lg:space-y-4 space-y-2 pl-8 text-gray-700 md:text-lg text-base">
                        <li>Go to <a href="https://developers.google.com/places/place-id" target="_blank" className="text-blue-600 underline">Google Place ID Finder</a>.</li>
                        <li>Search for your business name in the search bar.</li>
                        <li>Click on your business from the suggestions.</li>
                        <li>Copy the Place ID displayed below the business name.</li>
                      </ol>
                      <div className="flex justify-center mt-3 lg:mt-6">
                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/PlaceID%20img?updatedAt=1741521305563"
                          alt="Google Place ID Finder"
                          className="w-full max-w-2xl h-auto rounded-xl shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        />
                      </div>


                    </div>
                    <div className="bg-green-100 lg:p-6 p-2 rounded-xl border border-green-300 flex lg:items-center gap-2 lg:mt-10 mt-5">
                      <FaCheckCircle className="text-green-600 text-5xl hidden lg:block " />
                      <p className="text-green-900 text-base md:text-lg">Once you complete your registration, you can immediately log in to your dashboard using your registered email and password.</p>
                    </div>
                  </motion.div>
                )}


                {activeSection === "payment" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:p-6 p-3 bg-white rounded-lg ">
                    <h2 className="md:text-2xl text-xl font-semibold mb-2 lg:mb-4">Payment Process</h2>
                    <p className="text-gray-700 mb-3 md:text-base text-sm lg:mb-6">To activate your account, you must complete the payment process. We offer multiple payment methods for your convenience.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 lg:mb-8">
                      <div>
                        <h3 className="md:text-xl text-lg font-medium text-blue-800 mb-2 lg:mb-4">Payment Details</h3>
                        <div className="bg-yellow-50 lg:p-5 p-3 rounded-lg shadow-sm mb-3 lg:mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-700 md:text-base text-sm font-medium">Registration Fee:</span>
                            <span className="md:text-xl text-lg font-bold text-blue-600">₹749</span>
                          </div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-700 md:text-base text-sm font-medium">Validity Period:</span>
                            <span className="font-semibold text-gray-800 md:text-base text-sm">6 months</span>
                          </div>
                        </div>

                        <h3 className="md:text-xl text-lg font-medium text-blue-800 mb-3">We Accept</h3>
                        <ul className="grid grid-cols-2 gap-3">
                          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                            <FaMoneyBillWave className="text-green-600" />
                            <span className="md:text-base text-sm"> UPI </span>
                          </li>
                          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                            <FaMoneyBillWave className="text-purple-600" />
                            <span className="md:text-base text-sm">Net banking</span>
                          </li>
                          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                            <FaMoneyBillWave className="text-blue-600" />
                            <span className="md:text-base text-sm">Credit Cards</span>
                          </li>
                          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                            <FaMoneyBillWave className="text-gray-600" />
                            <span className="md:text-base text-sm">Debit Cards</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex justify-center items-center">
                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/UPi%20Trans?updatedAt=1741520629602"
                          alt="Payment Methods"
                          className="max-w-full h-auto rounded-lg shadow-md"
                          whileHover={{ scale: 1.05 }}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800 md:text-base text-sm">We have multiple payment options available. If your money gets debited due to any error, don't worry — it will be automatically refunded within 5 to 6 business working days.</p>
                    </div>
                  </motion.div>
                )}

                {activeSection === "dashboard" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:p-6 p-3 bg-white rounded-lg ">
                    <h2 className="lg:text-2xl text-xl font-semibold mb-2 lg:mb-4">Dashboard & Review Management</h2>
                    <p className="text-gray-700 lg:mb-6 mb-3 md:text-base text-sm">After successful registration and payment, log in to access your dashboard where you can monitor and manage all customer feedback.</p>

                    <div className="lg:mb-8 mb-4">
                      <h3 className="md:text-xl text-lg font-medium text-blue-800 mb-2 lg:mb-4">Dashboard Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3 lg:mb-6">
                        <div className="bg-gray-50 lg:p-5 p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <BsGraphUp className="text-green-500 md:text-xl text-lg" />
                            <h4 className="font-semibold text-gray-800 md:text-base text-sm">Graphical Insights (Performance Graph)</h4>
                          </div>
                          <p className="text-gray-600 md:text-base text-sm">View a graphical representation of your business performance based on customer feedback.</p>
                        </div>

                        <div className="bg-gray-50 lg:p-5 p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <BiSupport className="text-red-500 md:text-xl text-lg" />
                            <h4 className="font-semibold text-gray-800 md:text-base text-sm">Help & Support (Raise a Ticket)</h4>
                          </div>
                          <p className="text-gray-600 md:text-base text-sm">Raise a support ticket and track its status until resolved.</p>
                        </div>

                        <div className="bg-gray-50 lg:p-5 p-2 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <FaQrcode className="text-blue-500 md:text-xl text-lg" />
                            <h4 className="font-semibold text-gray-800 md:text-base text-sm">QR Code Download</h4>
                          </div>
                          <p className="text-gray-600 md:text-base text-sm">Easily download your QR Code from the dashboard anytime</p>
                        </div>

                        <div className="bg-gray-50 lg:p-5 p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <FaRegComments className="text-purple-500 text-xl" />
                            <h4 className="font-semibold text-gray-800 md:text-base text-sm">Account Settings</h4>
                          </div>
                          <p className="text-gray-600 md:text-base text-sm">Manage your business profile, update login credentials, and view payment details.</p>
                        </div>

                        <div className="bg-gray-50 lg:p-5 p-2 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <CiExport className="text-purple-500 text-xl" />
                            <h4 className="font-semibold text-gray-800">Export Reviews in PDF</h4>
                          </div>
                          <p className="text-gray-600">Download all customer feedback in PDF format for record-keeping.</p>
                        </div>

                        <div className="bg-gray-50 lg:p-5 p-2 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <GrTransaction className="text-purple-500 text-xl" />
                            <h4 className="font-semibold text-gray-800 md:text-base text-sm">Payment Transactions</h4>
                          </div>
                          <p className="text-gray-600 md:text-base text-sm">Track your subscription payments and view payment history anytime.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <motion.img
                        src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Dashboard%20img?updatedAt=1741521125672"
                        alt="Dashboard "
                        className="max-w-full rounded-lg shadow-lg"
                        whileHover={{ scale: 1.03 }}
                      />
                    </div>
                  </motion.div>
                )}

                {activeSection === "qr-usage" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:p-6 p-3 bg-white rounded-lg ">
                    <h2 className="md:text-2xl text-xl font-semibold mb-2 lg:mb-4">QR Code Usage</h2>
                    <p className="text-gray-700 md:text-base text-sm lg:mb-6 mb-3">You can use your QR code in various ways to collect customer feedback and improve your business. Whether it's printed materials or digital platforms, the QR code helps you gather valuable insights from your customers.</p>

                    <div className="bg-blue-50 lg:p-4 p-2 rounded-lg border border-blue-200 mb-3 lg:mb-6">
                      <h3 className="md:text-lg text-base font-medium text-blue-800 mb-2">Download & Share Your QR</h3>
                      <p className="text-gray-700 md:text-base text-sm">
                        With LogicQR, you have the flexibility to download your QR code for printing purposes or share it digitally with your customers.:
                      </p>
                      <div className="flex justify-center mt-3 lg:mt-6">
                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Qr%20img?updatedAt=1741521451228"
                          alt="Download/share QR"
                          className="w-full max-w-2xl h-auto rounded-xl shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4 lg:mb-8">
                      <div>
                        <h3 className="lg:text-xl text-lg font-medium text-blue-800 mb-2 lg:mb-4 flex items-center">
                          {/* <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-2">1</span> */}
                          Printed Materials
                        </h3>
                        <div className="space-y-3 mb-3 lg:h-[230px] lg:mb-6">
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">Product Packaging:</span> Print the QR code on product packaging for quick feedback.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm "><span className="font-medium">Posters/Banners:</span> Display QR codes at store entrances or exits.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">Brochures/Flyers: </span> Include QR codes in flyers or pamphlets for later feedback.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">Product Tags:</span> Attach QR codes to product tags for specific product reviews.</p>
                          </div>
                        </div>

                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Qr%20usage?updatedAt=1741521621441"
                          alt="Printed QR Usage"
                          className="w-full lg:h-[450px] rounded-lg object-cover shadow-md"
                          whileHover={{ scale: 1.03 }}
                        />
                      </div>

                      <div>
                        <h3 className="md:text-xl text-lg font-medium text-blue-800 lg:mb-4 mb-2 flex items-center">
                          {/* <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-2">2</span> */}
                          Digital Formats
                        </h3>
                        <div className="space-y-3 mb-3 lg:h-[230px] lg:mb-6">
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">WhatsApp: </span> Send the QR code link to customers through WhatsApp for quick reviews.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">Instagram/Facebook:</span> Share the QR code on your social media profiles or stories.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">Website Integration:</span> Embed the QR code on website to collect feedback from visitors.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span><BsXDiamondFill className="text-green-500 lg:text-xl text-lg mt-1" /></span>
                            <p className="text-gray-700 md:text-base text-sm"><span className="font-medium">SMS:</span> Send the QR code link via SMS to encourage instant feedback.</p>
                          </div>
                        </div>

                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/sharing%20review.jpg"
                          alt="Digital QR Usage"
                          className="w-full rounded-lg lg:h-[450px] object-center shadow-md"
                          whileHover={{ scale: 1.03 }}
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 lg:p-5 p-2 rounded-lg border border-green-200">
                      <h3 className="md:text-lg text-base font-medium text-green-800 mb-2">Customer Experience</h3>
                      <p className="text-gray-700 md:text-base text-sm">When customers scan the QR code, they are instantly directed to the review submission page, allowing them to share their feedback quickly and easily. This seamless process increases the chances of receiving more feedback.</p>
                    </div>
                  </motion.div>
                )}

                {activeSection === "support" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:p-6 p-3 bg-white rounded-lg ">
                    <h2 className="lg:text-2xl text-xl font-semibold mb-2 lg:mb-4">Support & Subscription</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4 lg:mb-8">
                      <div>
                        <h3 className="lg:text-xl text-lg font-medium text-blue-800 mb-2 lg:mb-4">Support</h3>
                        <div className="bg-blue-50 lg:p-5 p-3 rounded-lg shadow-sm mb-2 lg:h-[300px] lg:mb-4">
                          <p className="text-gray-700 mb-2 lg:mb-4 md:text-base text-sm">If you need any assistance or have technical issues, our support team is available to help.</p>

                          <div className="space-y-3 flex flex-col ">
                            <div className="flex gap-3">
                              <span><FaRegComments className="text-blue-500 text-lg md:text-xl" /></span>
                              <p className="text-gray-700 md:text-base text-sm">If you face any issues or need assistance, you can easily raise a support ticket from your Logic QR dashboard.</p>
                            </div>
                            <div className="flex gap-3">
                              <span><FaRegComments className="text-blue-500 text-lg md:text-xl " /></span>
                              <p className="text-gray-700 md:text-base text-sm">Our support team is available to help you with technical issues, payment-related queries, or any dashboard assistance.</p>
                            </div>
                            <div className="flex gap-3">
                              <span><FaRegComments className="text-blue-500 text-lg md:text-xl " /></span>
                              <p className="text-gray-700 md:text-base text-sm">You can find the Help option in your dashboard.</p>
                            </div>
                          </div>
                        </div>

                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Customer%20Support?updatedAt=1741521725454"
                          alt="Customer Support"
                          className="w-full lg:h-[300px] object-cover rounded-lg shadow-md"
                          whileHover={{ scale: 1.03 }}
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-medium text-blue-800 mb-4">Subscription Renewal</h3>
                        <div className="bg-yellow-50 lg:p-5 p-3 rounded-lg lg:h-[300px] shadow-sm mb-2 lg:mb-4">
                          <p className="text-gray-700 mb-2 lg:mb-4"></p>

                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <span> <FaCheckCircle className="text-green-500 mt-1 text-lg md:text-xl" /></span>
                              <p className="text-gray-700 md:text-base text-sm">Once you make a successful payment, your account will be activated instantly, and you can start using all features without any delay.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <span> <FaCheckCircle className="text-green-500 mt-1 text-lg md:text-xl" /></span>
                              <p className="text-gray-700 md:text-base text-sm">You can track your subscription details, payment history, and invoices from your dashboard anytime.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <span> <FaCheckCircle className="text-green-500 mt-1 text-lg md:text-xl" /></span>
                              <p className="text-gray-700 md:text-base text-sm">If your subscription expires, you will see a “Renew Payment” pop-up on your dashboard. Simply renew the subscription from there to continue using all the features without interruption.</p>
                            </div>
                          </div>
                        </div>

                        <motion.img
                          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/Renewal?updatedAt=1741521779015"
                          alt="Subscription Renewal"
                          className="w-full lg:h-[300px] object-cover rounded-lg shadow-md"
                          whileHover={{ scale: 1.03 }}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-600 text-white lg:p-5 p-2 rounded-lg shadow-md text-center">
                      <h3 className="md:text-xl text-lg font-medium mb-2">Take Your Business to the Next Level!</h3>
                      <p className="lg:mb-4 mb-2">Collect genuine customer reviews and improve your business performance using our LogicQR 🎉. </p>
                      <Link to="/register">
                        <button className="bg-white text-blue-600  md:text-base text-sm px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          Get Started Today
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}