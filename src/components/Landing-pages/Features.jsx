import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Features = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Simulate entrance animation
    setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Auto rotate testimonials
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Icons Components
  const StarIcon = ({ filled, size = 5 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-${size} h-${size} ${filled ? "text-yellow-400 fill-current" : "text-gray-300"}`}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );

  const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );

  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );

  const QrCodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-32 h-32" fill="currentColor">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z" />
    </svg>
  );

  const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
    </svg>
  );

  const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </svg>
  );

  const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  );

  const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM12 16c-1.65 0-3-1.35-3-3V5h6v8c0 1.65-1.35 3-3 3zm7-8c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );

  const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  );

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Cafe Sunrise",
      rating: 5,
      text: "Since using this review system, our Google ranking jumped from page 2 to the top of page 1. The QR code display at our counter gets us 10+ new reviews weekly!",
      image: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/portrait-beautiful-woman-isolated-yellow-studio-background.jpg?updatedAt=1741542540579"
    },
    {
      name: "Michael Roberts",
      business: "Urban Fitness",
      rating: 5,
      text: "I was skeptical, but the results speak for themselves. Our rating increased from 4.2 to 4.8 stars in just two months, and we've seen a 32% increase in new customers.",
      image: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/stylish-handsome-indian-man-tshirt-pastel-wall.jpg?updatedAt=1741541251874"
    },
    {
      name: "Amanda Thompson",
      business: "Glow Spa & Beauty",
      rating: 5,
      text: "The shareable links are perfect for our email campaigns. We're collecting 3x more reviews and converting more website visitors into paying customers.",
      image: "https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/eastern-woman.jpg?updatedAt=1741541236840"
    }
  ];

  return (
    <div>
      <Helmet>
        <link rel="canonical" href="https://www.logicqr.com/features" />
        <title>LogicQR Features - Track Reviews, Insights & Business Growth</title>
        <meta
          name="description"
          content="Explore the powerful features of LogicQR. Track customer feedback, monitor insights, and download QR codes to boost your business growth."
        />
        <meta
          name="keywords"
          content="LogicQR Features, Track Reviews, Customer Feedback, Business Growth, QR Code Download, Customer Insights"
        />
      </Helmet>
      <div className="bg-gradient-to-b from-gray-50 pt-10 to-white">
        {/* Interactive Hero Banner with Animation */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden relative">
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{
              backgroundImage: 'url("/api/placeholder/800/600")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateX(${scrollY * 0.1}px)`,
            }}
          />

          <div className="container mx-auto max-w-6xl py-20 px-4 relative">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 z-10">
                <div
                  className={`transition-transform duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <h2 className="text-5xl font-bold mb-6 leading-tight">Boost Your Business With <span className="text-yellow-300">Google Reviews</span></h2>
                  <p className="text-xl mb-8 text-blue-100">
                    Higher rankings mean more customers. Our smart feedback system helps you collect, manage, and showcase authentic reviews.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                      <div className="text-3xl font-bold text-yellow-300">76%</div>
                      <div className="text-sm">of customers trust online reviews</div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                      <div className="text-3xl font-bold text-yellow-300">3.7×</div>
                      <div className="text-sm">higher conversion with 5-stars</div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                      <div className="text-3xl font-bold text-yellow-300">93%</div>
                      <div className="text-sm">use reviews for decisions</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* <Link to='/register'>
                  <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                    Get Started Free
                  </button>
                  </Link>
                  <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-blue-700 transition-all duration-300">
                    Watch Demo
                  </button> */}
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 relative z-10">
                <div
                  className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ transform: `perspective(1000px) rotateY(${scrollY * 0.02}deg)` }}
                >
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-500 text-sm font-medium">Google Business Profile</div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <StoreIcon />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Your Business Name</h3>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} filled={true} />
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-600">5.0 (127 reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: isVisible ? '87%' : '0%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Google Search Visibility</span>
                        <span className="font-medium">87%</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Recent Customer Reviews</h4>

                      {testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className={`transition-opacity duration-500 ${activeIndex === index ? 'block opacity-100' : 'hidden opacity-0'}`}
                        >
                          <div className="flex items-start">
                            <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-800">{testimonial.name}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon key={star} filled={star <= testimonial.rating} size={4} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mt-1">{testimonial.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center mt-4">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full mx-1 transition-all ${activeIndex === index ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                            aria-label={`Testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <ArrowUpIcon />
                      </div>
                      <div>
                        <div className="text-green-800 font-medium">Rankings Improving</div>
                        <div className="text-green-600 text-sm">+32% more visibility this month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white opacity-20"></div>
        </div>

        {/* Importance of Google Ranking Section */}
        <div className="container mx-auto max-w-6xl py-16 px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <div className="p-1 bg-yellow-100 inline-block rounded-full mb-4">
                <div className="bg-yellow-400 p-3 rounded-full">
                  <ArrowUpIcon />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-800">Why Google Rankings Matter</h3>
              <p className="text-gray-600 text-lg mb-6">
                93% of consumers use online reviews to make purchase decisions. Businesses with higher Google ratings appear more prominently in search results, attracting more visitors and converting them into customers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-700 text-lg mb-2">76%</h4>
                  <p className="text-gray-700">of customers trust online reviews as much as personal recommendations</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-700 text-lg mb-2">3.7×</h4>
                  <p className="text-gray-700">higher conversion rate for businesses with 5-star ratings</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <StoreIcon />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">Your Business Name</h4>
                        <p className="text-sm text-gray-500">Local Business</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                      Google Rating
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} filled={true} />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-800">5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div className="bg-yellow-400 h-2.5 rounded-full w-full"></div>
                    </div>
                    <p className="text-right text-sm text-gray-500">Based on 127 reviews</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Search Visibility</span>
                    <span className="font-medium text-green-600">+68% This Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How Our System Works */}
          <div className="text-center mb-16">
            <div className="inline-block p-1 bg-blue-100 rounded-full mb-4">
              <div className="bg-blue-500 p-3 rounded-full">
                <MessageIcon />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-6 text-gray-800">How Our Feedback System Boosts Your Rankings</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Our intelligent system helps you collect authentic customer reviews and publish feedback directly to Google, improving your online visibility.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <MessageIcon />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">Collect Feedback</h4>
                <p className="text-gray-600">
                  Easily gather customer opinions through customized feedback forms that are simple to complete.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <AwardIcon />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">Filter Quality</h4>
                <p className="text-gray-600">
                  Our smart system identifies valuable reviews and encourages customers to share them on Google.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <ChartIcon />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">Rise in Rankings</h4>
                <p className="text-gray-600">
                  Watch your Google rating improve as authentic positive reviews accumulate, boosting your visibility.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <h3 className="text-3xl font-bold mb-2 text-center text-gray-800">Powerful Features for Every Business</h3>
          <p className='mb-8 text-center text-gray-500 md:px-6'>You can use your QR code in various ways to collect customer feedback and improve your business. Whether it's printed materials or digital platforms, the QR code helps you gather valuable insights from your customers.</p>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Online Business Link Feature */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="h-72 bg-blue-50 relative">
                <div className="absolute inset-0 flex items-center justify-center ">

                  <img src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/social-media-1200x800.webp?updatedAt=1741539627596" alt="" />

                </div>
                <div className="absolute top-4 right-4 bg-white text-blue-700 text-xs font-bold py-1 px-2 rounded-full">
                  ONLINE
                </div>
              </div>
              <div className="p-8 mt-5">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Shareable Review Links</h3>
                <p className="text-gray-600 mb-6">
                  Custom review links for your business that can be shared across all social media platforms, email campaigns, and digital touchpoints.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700">Share the QR code on your social media profiles or stories.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700">Embed the QR code on your website to collect feedback from visitors.
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700">Send the QR code link via SMS to encourage instant feedback.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Business QR Code Feature */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="h-72 bg-purple-50 relative">
                <div className="absolute inset-0 flex items-center justify-center">


                  <img src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Home%20page%20Assets/qr-codes-for-google-reviews%20(1).webp?updatedAt=1741539627691" alt="" />


                </div>
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                  OFFLINE
                </div>
              </div>
              <div className="p-8 mt-5">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">QR Code Review System</h3>
                <p className="text-gray-600 mb-6">
                  Downloadable QR codes that can be printed and displayed in your physical store, allowing customers to scan and leave reviews instantly.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700">Display QR codes at store entrances or exits.
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700">Attach QR codes to product tags for specific product reviews.
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700">Print the QR code on product packaging for quick feedback.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  )
}
export default Features