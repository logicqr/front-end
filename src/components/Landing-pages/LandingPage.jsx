import React from 'react';
import { useState,useEffect,useRef } from "react";
import { PiHandTap } from "react-icons/pi";
import { TbFilterPin,TbStar,TbMessageChatbot } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io";
import { PiArrowFatLinesUpLight } from "react-icons/pi";
import Footer from './Footer';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FiUsers, FiGlobe, FiAward, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { FaUsers, FaGlobeAmericas, FaTrophy, FaChartLine,FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
// import { Link } from "react-scroll";
import { Helmet } from 'react-helmet';




const benefits = [
  {
    title: "Instant Review Collection",
    description:
      "Customers can easily scan and submit reviews in seconds, boosting your online reputation effortlessly.",
    icon: <PiHandTap />,
    img: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/zs-started-instantly.png?updatedAt=1741183903905"
  },
  {
    title: "Filter Feedback to Improve Business",
    description:
      "Every feedback, whether positive or negative, is valuable for your business growth. Our system captures both types of feedback, helping you understand customer experiences and make continuous improvements.",
    icon: <TbFilterPin />,
    img: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/zs-leads-to-customer.png?updatedAt=1741183904124"
  },
  {
    title: "User-Friendly Dashboard",
    description:
      "Manage all feedback, QR codes, and account details from a single dashboard.",
    icon: <PiArrowFatLinesUpLight />,
    img: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/zs-streamline.png?updatedAt=1741183903617"
  },

];

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const metrics = [
    {
      icon: FaUsers,
      target: 10000,
      unit: '+',
      label: 'Active Users',
      color: 'text-blue-500',
      hoverColor: 'text-blue-600',
      duration: 2.5
    },
    {
      icon: FaStar,
      target: "5",
      unit: '/5',
      label: 'Customer Satisfaction',
      color: 'text-yellow-500',
      hoverColor: 'text-yellow-600',
      duration: 1.5
    },
    {
      icon: FaTrophy,
      target: "167800",
      unit: '+',
      label: 'Overall Reviews',
      color: 'text-yellow-500',
      hoverColor: 'text-yellow-600',
      duration: 1.5
    },
    {
      icon: FaChartLine,
      target: 10,
      unit: 'X',
      label: 'Growth',
      color: 'text-purple-500',
      hoverColor: 'text-purple-600',
      duration: 2
    }
  ];

  const users = [
    { id: 1, name: 'user1' },
    { id: 2, name: 'user2' },
    { id: 3, name: 'user3' },
    { id: 4, name: 'user4' },
    { id: 5, name: 'user5' }
  ];

  // Custom intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Custom count-up animation
  useEffect(() => {
    if (!isVisible) return;

    const intervals = metrics.map((metric, index) => {
      const increment = metric.target / (metric.duration * 60); // 60fps
      let currentCount = 0;

      return setInterval(() => {
        currentCount += increment;
        if (currentCount >= metric.target) {
          currentCount = metric.target;
          clearInterval(intervals[index]);
        }

        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(currentCount);
          return newCounts;
        });
      }, 1000 / 60); // 60fps
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [isVisible]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrors({ general: "Please fill all the fields." });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://back-end-ivnr.onrender.com/v1/send-mail", formData);
      if (response.status === 200) {
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        const newErrors = {};
        error.response.data.error.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: "Server error. Please try again later." });
      }
    }

    setLoading(false);
    setTimeout(() => {
      setSuccessMessage('')
    }, 5000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % benefits.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [benefits.length]);

  const selectedBenefit = benefits[selectedIndex];


  return (
    <div>
      <Helmet>
        <link rel="canonical" href="https://www.logicqr.com" />
        <title>LogicQR - Collect, Track, and Improve Feedback</title>
        <meta name="description"
          content="LogicQR helps businesses collect feedback through QR codes. With LogicQR, you can easily track reviews, monitor insights, and improve business growth." />
      </Helmet>
      <div className='bg-gradient-to-r from-blue-100 to-gray-50 md:pt-0 pt-8'>
        <div className=' '>
          <div className="lg:min-h-screen h-[80vh]   text-center flex flex-col justify-center items-center p-2 lg:p-6 relative overflow-hidden"
          //   style={{
          //   backgroundImage: 'url("https://img.freepik.com/free-photo/realistic-phone-with-social-media_23-2151459589.jpg")',
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
          >

            {/* Main Content */}
            <section className="text-center py-16">
              <div className="max-w-4xl mx-auto">
                <div className="bg-indigo-100 w-max mx-auto p-3 rounded-2xl mb-6">
                  <span className="text-indigo-600 font-medium">Customer Feedback Revolutionized</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Transform Feedback into<br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Business Growth
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Automate review management, enhance customer experience, and boost your online reputation
                  with our intelligent QR-based solution.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <Link to={'/register'} className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all">
              Get Started
              </Link>
                  {/* <Link offset={-80} className="cursor-pointer bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all" to="/contact" smooth={true} duration={500}> Get Started</Link> */}
                  <Link to={'/docs'} className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-all">
                  How It Works
                </Link>
                </div>

              </div>
            </section>
            {/* Vector Illustration */}
            <div className="hidden md:block absolute bottom-0 right-0 transform translate-x-20 translate-y-20 opacity-90">
              <img
                src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/Home%20page%20image?updatedAt=1741522995477"
                alt="Review Illustration"
                className="lg:w-[480px] md-[400px] w-[300px] h-auto"
              />
            </div>

          </div>

          <div className="">

            <div className="lg:w-full ">
              <div className="hidden lg:flex mx-auto">
                {/* Left Sidebar */}
                <div className="w-1/2 bg-[#190900] rounded-r-3xl flex flex-col items-center justify-center text-white ">
                  <div className=" w-[80%] ">
                    <h2 className="text-5xl font-bold">Our Product Benefits</h2>
                  </div>
                  <div className="mt-6 space-y-4 w-[80%] mx-auto">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className={`relative flex items-center justify-between gap-3  pb-4 cursor-pointer transition-all duration-300 border-b overflow-hidden ${selectedBenefit.title === benefit.title
                          ? "text-yellow-400"
                          : "hover:text-yellow-300"
                          }`}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <span
                          className={`absolute bottom-0 left-0 h-[2px] bg-yellow-400 transition-transform duration-500 ease-out ${selectedBenefit.title === benefit.title
                            ? "w-full scale-x-100"
                            : "w-0 scale-x-0"
                            }`}
                          style={{ transformOrigin: "left" }}
                        />
                        <div className="flex items-center">
                          <span className="text-5xl">{benefit.icon}</span>
                          <span className="text-xl font-semibold">{benefit.title}</span>
                        </div>
                        <span className={`flex transition-opacity duration-300 ${selectedBenefit.title === benefit.title ? "opacity-100" : "opacity-0"}`}>
                          <FaArrowRight />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content Section */}
                <div className="w-1/2 h-screen   p-8 flex flex-col mt-5">
                  <div className="w-[90%] mx-auto flex gap-3 rounded-lg">
                    <div>
                      <span className="text-white w-16 h-16 bg-yellow-500 rounded-md flex items-center justify-center text-3xl">
                        {selectedBenefit.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold flex items-center gap-2">
                        {selectedBenefit.title}
                      </h3>
                      <p className="mt-4 text-gray-700 h-24 text-lg">{selectedBenefit.description}</p>
                    </div>
                  </div>
                  <div className="mt-6  flex items-center justify-center">
                    <img src={selectedBenefit.img} alt={selectedBenefit.title} className="rounded-lg w-[450px] h-[450px] object-cover" />
                  </div>
                </div>
              </div>

              {/* Small Screen View */}
             <div className="lg:hidden bg-[#190900] text-white flex flex-col items-center text-center py-6">
      <div className="w-11/12 rounded-lg shadow-lg mt-4 min-h-[600px] flex flex-col">
        <h2 className="text-3xl font-bold mb-4 h-12 flex items-center justify-center">
          Our Product Benefits
        </h2>
        
        <div className="flex-grow flex flex-col">
          {/* Fixed-size container for content */}
          <div className="flex-grow flex flex-col">
            {/* Icon Container */}
            <div className="h-16 flex items-center justify-start">
              <span className="text-white flex items-center justify-center rounded-md w-12 h-12 bg-yellow-500 text-4xl">
                {selectedBenefit.icon}
              </span>
            </div>
            
            {/* Text Content Container */}
            <div className=" h-40 overflow-hidden text-start">
              <h3 className="text-2xl font-bold mt-2 h-10 overflow-hidden">
                {selectedBenefit.title}
              </h3>
              <p className="text-gray-300 mt-2 h-24 overflow-hidden">
                {selectedBenefit.description}
              </p>
            </div>
            
            {/* Image Container */}
            <div className="h-96 flex items-center justify-center">
              <div className="w-[400px] h-full overflow-hidden rounded-lg">
                <img
                  src={selectedBenefit.img}
                  alt={selectedBenefit.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex gap-3 mt-4 h-6 justify-center items-center">
          {benefits.map((_, index) => (
            <span
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`cursor-pointer h-3 rounded-full transition-all duration-300 ${
                selectedIndex === index ? "w-8 bg-yellow-500" : "w-3 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
            </div>

            <section className="py-20 mt-5">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our simple three-step process makes it easy to start collecting better reviews today.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="md:w-1/3 text-center p-6">
                    <div className="bg-blue-600 animate-bounce rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your QR Code</h3>
                    <p className="text-gray-600">
                      <span className='font-semibold'>Register your business</span> with Logic QR and access your <span className='font-semibold'>dashboard.</span>
                      Download your <span className='font-semibold'>unique QR code</span> to collect customer feedback.
                    </p>
                  </div>

                  <div className="hidden md:block w-16">
                    <svg className="w-full text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  <div className="md:w-1/3 text-center p-6">
                    <div className="bg-blue-600 animate-bounce rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Share & Collect Feedback</h3>
                    <p className="text-gray-600">
                      <span className='font-semibold'>Print the QR code</span> for your store or <span className='font-semibold'>share it digitally</span> via <span className='font-semibold'>WhatsApp, Email, Social Media, or Website.</span>
                      Customers can <span className='font-semibold'>scan the QR code</span> and submit their feedback instantly.
                    </p>
                  </div>

                  <div className="hidden md:block w-16">
                    <svg className="w-full text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  <div className="md:w-1/3 text-center p-6">
                    <div className="bg-blue-600 animate-bounce rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Track & Improve</h3>
                    <p className="text-gray-600">
                      Monitor all customer feedback from your dashboard.
                      Use the insights to <span className='font-semibold'>improve your services and boost your business growth.</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>


            <div className="grid md:grid-cols-2 container mx-auto mt-10 p-4 md:p-10 gap-10">
              {/* QR Scan Link */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 md:hover:scale-105">
                <div className="h-72 bg-blue-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img
                      src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/what-is-a-whatsapp-group-link-1671305180833-compressed.jpg?updatedAt=1741539627537"
                      alt="QR Code Scan Link"
                      className="max-h-full object-contain rounded-lg shadow-md"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                    INSTANT
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">QR Scan Link</h3>
                  <p className="text-gray-600 mb-6">
                    Share a personalized QR code that customers can scan to leave reviews instantly, no app downloads required.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">One-scan access to review page</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Easily shareable</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Trackable insights</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Bar */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 md:hover:scale-105">
                <div className="h-72 bg-purple-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img
                      src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/qr-codes-for-google-reviews%20(1).webp?updatedAt=1741539627691"
                      alt="QR Bar Display"
                      className="max-h-full object-contain rounded-lg shadow-md"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                    QR Scan
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">QR Code Display</h3>
                  <p className="text-gray-600 mb-6">
                    Download your QR code from the dashboard to print or share it digitally for collecting customer feedback.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Download QR Code</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Easy Display</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Flexible Usage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex flex-col md:flex-row items-center justify-between my-16  py-16 w-[90%] mx-auto">
              {/* Left Side - Illustration */}
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <img
                  src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/zcrm_signup_promo.webp?updatedAt=1741194215200"
                  alt="Rocket Launch Illustration"
                  className="max-w-xs md:max-w-md"
                />
              </div>

              {/* Right Side - Text Content */}
              <div className="w-full md:w-1/2  flex flex-col justify-center item-start md:mt-0">
                <div className="md:ml-16">
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 l">
                    More Feedback. <br /> Understand Needs. <br /> Boost Business Growth.
                  </h1>

                  <p className="text-gray-600 text-left text-lg mt-4 ">
                    💡 Start Using LogicQR Today!
                  </p>


                  {/* Buttons */}
                  <div className="mt-6 flex flex-col lg:flex-row items-start gap-4">
                    <Link to={'/register'}className="bg-red-500 text-white px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-red-600">
                    Get Started Now
                  </Link>
                    {/* <Link offset={-80} className="cursor-pointer bg-red-500 text-white px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-red-600" to="/contact" smooth={true} duration={500}> Get Started Now</Link> */}

                  </div>
                </div>
              </div>
            </div>


          </div>
          <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-6 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-300"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Trusted by Businesses Worldwide
          </h2>
          <p className=" text-gray-600 max-w-2xl mx-auto">
            Join thousands of companies accelerating their growth with our platform
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
              variants={itemVariants}
              whileHover="hover"
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
            >
              {/* Animated background highlight on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${isHovered === index ? `from-${metric.color.replace('text-', '')}-50 to-white` : 'from-white to-white'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10 text-center">
                <div className={`${metric.color} mb-6 text-4xl flex justify-center`}>
                  <metric.icon className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {counts[index].toLocaleString()}
                  <span className="text-xl ml-1">{metric.unit}</span>
                </h3>
                <p className="text-gray-600 text-lg">{metric.label}</p>
                
                {/* Animated arrow that appears on hover */}
                {/* <motion.div
                  className={`mt-4 text-${metric.color.replace('text-', '')}-500 flex items-center justify-center`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isHovered === index ? 1 : 0,
                    x: isHovered === index ? 0 : -10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <FiArrowRight className="mr-1" />
                  <span className="text-sm font-medium">Learn more</span>
                </motion.div> */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 max-w-4xl mx-auto border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center">
              <div className="hidden md:flex -space-x-3 relative mr-6">
                {users.map((user, i) => (
                  <motion.div
                    key={user.id}
                    className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 md:flex items-center justify-center overflow-hidden relative"
                    style={{ zIndex: users.length - i }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
               
              </div>
              <div>
                <p className="text-gray-700 text-xl font-medium">
                  <span className="text-blue-600 font-bold">2,500+</span> businesses trust us
                </p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-500 ml-2 text-sm">5.0 (167k+ reviews)</span>
                </div>
              </div>
            </div>
            <Link to={'/register'}>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ 
                background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
              }}
            >
              Get Started
              <FiArrowRight className="ml-2" />
            </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Real feedback from businesses using LogicQR to improve customer experience and grow their business.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">


                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-center mb-6">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "The QR code system is amazing! We placed them on tables and bills, and the number of reviews shot up. Now, we can see customer feedback easily and take action when needed."
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Priya Ravi</h4>
                      <p className="text-gray-600 text-sm">Restaurant Manager</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-center mb-6">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "The analytics dashboard gives us a clear understanding of customer satisfaction. We made small changes based on feedback, and our rating improved from 3.8 to 4.7 in just six months."
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Senthil Raj</h4>
                      <p className="text-gray-600 text-sm">Hotel Owner, Madurai</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-center mb-6">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "Since using ReviewBoost, the number of reviews for our bakery has tripled in just three months. More people are discovering us online, and our customer visits have increased."
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">Arun Kumar</h4>
                      <p className="text-gray-600 text-sm">Bakery Owner, Chennai</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>



          {/* Pricing Section */}
          <section className="py-20 ">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Limited Time Offer!</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get LogicQR's complete feedback solution at an unbeatable price.</p>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-6xl mx-auto">
                {/* Left Plan (Dimmed) */}
                <div className="w-full md:w-1/3 border border-gray-300 rounded-xl p-6 opacity-60 hover:opacity-80 transition-opacity duration-300 transform md:-rotate-3 md:scale-90 bg-gray-50">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Standard Plan</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-800">₹1599</span>
                      <span className="text-gray-600"> /6 months</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Unlimited Customer Feedback</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Basic analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Customer Support</span>
                    </li>
                  </ul>
                  <button disabled className="w-full bg-gray-200 text-gray-500 font-medium py-2 rounded-lg cursor-not-allowed">
                    Not Available
                  </button>
                </div>

                {/* Center Plan (Highlighted) */}
                <div className="w-full md:w-1/3 border-2 border-blue-600 rounded-xl p-8 shadow-xl relative bg-white transform md:scale-110 z-10 mb-10 md:mb-0">

                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center transform rotate-12">
                    <div className="text-center leading-none">
                      <span className="text-red-700 font-extrabold text-sm">SAVE</span>
                      <p className="font-bold text-red-800 text-lg">70%</p>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
                    <p className="text-gray-600 text-sm">Everything you need for your business</p>
                  </div>

                  <div className="flex justify-center items-center gap-4 mb-2">
                    <div className="relative">
                      <span className="text-xl text-gray-400 line-through">₹1599</span>
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 transform -rotate-12"></div>
                    </div>
                    <div className="relative">
                      <span className="text-xl text-gray-400 line-through">₹2449</span>
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 transform -rotate-12"></div>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="bg-yellow-100 rounded-lg py-2 px-4 inline-block border-b-4 border-yellow-400">
                      <span className="text-4xl font-bold text-gray-900">₹749</span>
                      <span className="text-gray-700 font-medium"> / 6 months</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-lg font-medium text-green-600">Just ₹4 Rupees per Day!</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600"> Unlimited Customer Feedback</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Easy QR Sharing Link</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Easy Print-Ready QR Code</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Detailed Insights & Analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Dedicated Customer Support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Dedicated Dashboard</span>
                    </li>
                    {/* <li className="flex items-center">
      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-gray-600">Priority customer support</span>
    </li> */}
                  </ul>

                  <Link to="/register">
                <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 shadow-lg">
                  Get Started Now
                </button>
                </Link>
                </div>

                {/* Right Plan (Dimmed) */}
                <div className="w-full md:w-1/3 border border-gray-300 rounded-xl p-6 opacity-60 hover:opacity-80 transition-opacity duration-300 transform md:rotate-3 md:scale-90 bg-gray-50">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Enterprise Plan</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-800">₹2449</span>
                      <span className="text-gray-600"> /6 months</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Unlimited Customer Feedback</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Basic analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Dedicated Dashboard</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">Customer Support</span>
                    </li>
                  </ul>
                  <button disabled className="w-full bg-gray-200 text-gray-500 font-medium py-2 rounded-lg cursor-not-allowed">
                    Not Available
                  </button>
                </div>
              </div>
            </div>
          </section>



          <div className="relative flex items-center justify-center min-h-screen">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{
                backgroundImage: `url('https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/background-gradient-line-digital-abstract.png?updatedAt=1741254840710')`,
              }}
            ></div>

            <div  className="relative lg:w-[80%] w-[90%] mx-auto flex flex-col md:flex-row items-center lg:p-8 ">
              {/* Left Side - Form */}
              <div className="md:w-1/2 w-full order-2 md:order-1 p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Drop us a line</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-gray-700 font-medium">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="What's your full name?"
                      className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.name && <p className="text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && <p className="text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.phone && <p className="text-red-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message for the team here"
                      className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-28"
                    ></textarea>
                    {errors.message && <p className="text-red-600">{errors.message}</p>}
                  </div>
                  <div className="flex justify-center items-center">
                    {/* Success Message */}
                    {successMessage && <p className="text-green-600 font-semibold">{successMessage}</p>}
                    {/* General Error */}
                    {errors.general && <p className="text-red-600 font-semibold">{errors.general}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Submit"}
                  </button>
                </form>
              </div>

              {/* Right Side - Illustration */}
              <div className="md:w-1/2 w-full flex justify-center order-1 md:order-2 p-6">
                <img
                  src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/hand_drawn_send_airplane.png?updatedAt=1741250297796"
                  alt="Illustration"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Footer />


        </div>
      </div>
    </div>
  )
}

export default LandingPage