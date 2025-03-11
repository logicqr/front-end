import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../auth/axios";


const ReviewForm = () => {
  const { id: userId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [paying,setPaying] = useState(false)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await axios.get(
          `https://back-end-g1hg.onrender.com/v1/subscription/check/${userId}`
        );
        // console.log(response)
        setIsSubscriptionActive(response.data.isActive);
        setBusinessName(response.data.businessName || "");
        setIsChecking(false);
      } catch (error) {
        console.error("Subscription check error:", error);
        setIsSubscriptionActive(false);
        setIsChecking(false);
      }
    };

    checkSubscription();
  }, [userId]);

  // const renewSubscription = async () => {
  //   setPaying(true)
  //   try {
  //     const response = await axiosInstance.post("/renew-subscription", {
  //       user_id: userId, // Replace with actual user ID
  //     });

  //     if (response.status === 200) {
  //       // console.log(response.data.order.id);
  //       // console.log(response.data.order.amount);

  //       const options = {
  //         key: "rzp_live_R4krQLCHamePO8", // Use env variable
  //         amount: response.data.order.amount,
  //         currency: "INR",
  //         order_id: response.data.order.id,
  //         handler: function (response) {
  //           // console.log("Payment Successful:", response);
  //           window.location.reload();
  //         },
  //         prefill: {
  //           name: "John Doe",
  //           email: "john@example.com",
  //           contact: "9876543210",
  //         },
  //         theme: { color: "#3399cc" },
  //       };

  //       const rzp1 = new window.Razorpay(options);
  //       rzp1.open();
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setPaying(false)
  //   }
  // };

  const handleSubmit = async (skipDetails = false) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `https://back-end-g1hg.onrender.com/v1/review/${userId}`,
        {
          name: skipDetails ? null : name,
          comment: skipDetails ? null : comment,
          rating,
        }
      );
      if (response.data.redirectUrl && (skipDetails || rating > 3)) {
        window.location.href = response.data.redirectUrl;
      } else {
        setName("");
        setComment("");
        setCurrentStep(3);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const StarIcon = ({ filled }) => (
    <svg
      className={`w-12 h-12 transition-all duration-300 transform ${
        filled
          ? "text-yellow-500 scale-110"
          : "text-gray-300 hover:text-gray-400"
      }`}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1"
    >
      <path
        strokeLinecap="square"
        strokeLinejoin="miter"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  const getRatingText = () => {
    const ratingInfo = [
      { text: "Select your rating", color: "text-gray-400" },
      {
        text: "Poor - Needs significant improvement",
        color: "text-red-500",
        bgColor: "bg-red-50",
      },
      {
        text: "Fair - Could be better",
        color: "text-orange-500",
        bgColor: "bg-orange-50",
      },
      {
        text: "Good - Meets expectations",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
      },
      {
        text: "Very Good - Above average",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
      {
        text: "Excellent - Outstanding service",
        color: "text-green-500",
        bgColor: "bg-green-50",
      },
    ];
    return ratingInfo[hoverRating || rating || 0];
  };

  const CheckIcon = () => (
    <svg
      className="w-12 h-12 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  if (isChecking) {
    return (
      <div className="max-w-md mx-auto my-20 px-8 py-20 bg-white rounded-2xl md:shadow-xl bg-opacity-50 backdrop-blur-lg">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-gray-200 rounded-full w-3/4 mx-auto" />
          <div className="flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#E5E7EB",
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-center gap-6">
            <div className="h-5 bg-gray-200 rounded-full w-24 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-full w-24 animate-pulse" />
          </div>
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-300 rounded-full"
                style={{
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isSubscriptionActive) {
    return (
      <div className="max-w-xl mx-3 md:mx-auto my-28">
  <div className="bg-white rounded-3xl  overflow-hidden backdrop-blur-lg bg-white/90">
    {/* Main Content Section */}
    <div className="py-10 px-6">
      <div className="flex flex-col items-center">
        <div className="relative mb-3 group">
          <div className="absolute -inset-3 bg-purple-100 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative text-red-500 animate-bounce">
          <svg
                    className="w-24 h-24 transform group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
          </div>
        </div>

        <div className="text-center space-y-5">
          <h2 className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-red-600 ">
            404
          </h2>
          <p className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </p>
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for seems to have vanished into the digital void.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }

  return (
    <div className="max-w-md md:mx-auto flex items-center my-12 mx-2 justify-center min-h-[500px]  p-8 bg-white rounded-3xl transition-all duration-300 hover:shadow-blue-200/30 backdrop-blur-lg">
      {currentStep === 1 && (
        <div className="w-full space-y-12 text-center">
        {businessName && (
          <div className="relative bg-white rounded-xl">
            {/* Google Logo */}
            <div className="flex justify-center">
              <img 
                src="https://yt3.googleusercontent.com/FJI5Lzbf2dMd32xOqhoKpJArJooZhoX6v2qOcFO-wjSZUvs3H9xqq2gK4DQ47X0KnYgf7X2rpdU=s900-c-k-c0x00ffffff-no-rj"
                alt="Google"
                className="w-32 h-32 object-contain"
              />
            </div>
      
            {/* Business name */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {businessName}
            </h1>
      
            {/* Feedback message */}
            <div className="flex items-center justify-center text-gray-600">
              <svg
                className="hidden md:block w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Share your experience with {businessName}</span>
            </div>
          </div>
        )}

          {/* Rating Section with Enhanced Interaction */}
          <div className="space-y-10">
            <div className="flex flex-col items-center space-y-8">
              <div className="flex justify-center space-x-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    // className="transform transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none group"
                  >
                    <StarIcon filled={star <= (hoverRating || rating)} />
                  </button>
                ))}
              </div>

              {/* Enhanced Rating Text Display */}
              <div
                className={`transform transition-all duration-300 ${
                  getRatingText().bgColor
                } rounded-xl px-6 py-3 group hover:scale-105`}
              >
                <div
                  className={`text-lg font-medium ${
                    getRatingText().color
                  } transition-colors duration-300`}
                >
                  {getRatingText().text}
                </div>
              </div>
            </div>

            {rating > 0 && (
              <div className="flex justify-center animate-fade-in-up">
                <button
                  onClick={() =>
                    rating > 3 ? handleSubmit(true) : setCurrentStep(2)
                  }
                  disabled={isLoading}
                  className={`relative px-10 py-4 text-lg font-semibold text-white rounded-2xl transition-all
                    bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                    transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl
                    focus:outline-none focus:ring-4 focus:ring-blue-500/20 group
                    ${isLoading ? "opacity-80 cursor-progress" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin mr-3" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Continue
                      <svg
                        className="w-5 h-5 ml-2 text-white/90 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="w-full space-y-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md">
              {rating}/5 Rating
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Share More Details
            </h2>
            <p className="text-gray-500">Help us improve your experience</p>
          </div>

          <div className="space-y-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 hover:border-gray-300 text-gray-700"
              placeholder="Your feedback helps! What can we fix?"
              rows={3}
            />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 hover:border-gray-300 text-gray-700"
              placeholder="Your name (optional)"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                if (!comment.trim()) {
                  setError("Please enter your feedback before submitting.");
                  return;
                }
                setError(""); // Clear error if input is valid
                handleSubmit();
              }}
              disabled={isLoading}
              className={`w-full py-4 text-lg font-semibold text-white rounded-2xl transition-all
    bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
    transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl
    ${isLoading || !comment.trim() ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Submitting...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>

            <button
              onClick={() => setCurrentStep(1)}
              className="w-full py-4 text-blue-600 hover:text-blue-700 border border-blue-100 shadow-md font-medium transition-all rounded-2xl hover:bg-blue-50 focus:ring-4 focus:ring-blue-500/20"
            >
              Back to Rating
            </button>
          </div>

          {error && (
            <div className="p-6 text-sm text-red-600 bg-red-50 rounded-2xl flex items-center shadow-inner">
              <svg
                className="w-6 h-6 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center space-y-10 py-6 animate-fade-in">
          <div className="animate-bounce-in">
            <div className="inline-flex bg-gradient-to-br from-green-100 to-green-50 rounded-full p-6 shadow-inner">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 shadow-xl animate-icon-pop">
                <CheckIcon />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Thank You! <span className="text-yellow-600">🎉</span>
            </h2>
            <p className="text-gray-600 text-lg">
              We truly appreciate your feedback.
            </p>
            <p className="text-gray-600 text-base opacity-75">
              Apologies for the inconvenience. We value your feedback and will
              fix it within 12-24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
