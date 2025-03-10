import React from "react";
import { useState, useEffect } from "react";
import { LuShieldQuestion } from "react-icons/lu";
import { LuTicket } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { IoLogoYoutube } from "react-icons/io";
import { motion } from "framer-motion";
import { BsChatHeart } from "react-icons/bs";
import { MdOutlinePendingActions, MdDomainVerification } from "react-icons/md";
import { CiMail } from "react-icons/ci"; // ALL
import { IoMailUnreadOutline } from "react-icons/io5";
import { RiMailSendLine } from "react-icons/ri";
import { RiMailCheckLine } from "react-icons/ri"; // CLOSED
import { RiInstagramLine, RiLinkedinFill } from "react-icons/ri";
import axiosInstance from "../auth/axios";

const Help = () => {
  const faqData1 = [
    {
      question: "Do I need any technical knowledge to use this system?",
      answer:
        "No, our system is user-friendly and requires no technical expertise. Simply scan, review, and monitor feedback from your dashboard.",
    },
    {
      question: "How do I access my dashboard?",
      answer: "Once your payment is completed, you can  access your dashboard. You can view feedback, track reviews, and respond to customer concerns.",
    },
    {
      question: "What if I lose my QR code?",
      answer:
        "No worries! You can download your QR code again from your dashboard. If you need help, contact our support team.",
    },
    {
      question: "How soon can I start receiving feedback?",
      answer:
        "You can start collecting reviews immediately after setting up your QR code.",
    },
];

const faqData3 = [
    {
      question: "My QR code is not scanning. What should I do?",
      answer:
        "  Ensure the QR code is clear and not blurry. Try reprinting it if needed. If the issue persists, download your QR code again from the dashboard.",
    },
    {
      question: "My dashboard is not loading!",
      answer: " Refresh the page and check your internet connection. Try opening the dashboard in another browser or incognito mode.",
    },
    {
      question: "A customer left a review, but I can't see it.",
      answer:
        " Reviews may take a few minutes to appear on the dashboard. Ensure the customer completed the review process and submitted it.",
    },
    {
      question: "My payment went through, but I didn’t get access.",
      answer:
        "Check if the amount was deducted from your account.",
    },
];

const faqData2 = [
    {
      question: "Is there a cost to use the QR feedback system?",
      answer:
        "Yes, a one-time payment is required to activate your account and receive your QR code and dashboard access.",
    },
    {
      question: "How long does it take for positive reviews to appear online?",
      answer: "Positive reviews are usually published instantly, but in some cases, they may take a few minutes to reflect.",
    },
    {
      question: "Can I download my negative reviews for record-keeping?",
      answer:
        "Yes! You can export negative reviews from your dashboard to keep track of customer feedback over time.",
    },
    {
      question: "Can I integrate this system with my website?",
      answer:
        "Yes! You can add the QR code or feedback link to your website and social media pages.",
    },
];

const faqData4 = [
    {
      question: " Make a Payment",
      answer: "Complete the payment process to activate your account. Once the payment is confirmed, you can access a QR code and dashboard access. ",
    },
    {
      question: "Set Up Your QR Code.",
      answer:
        "Place it at visible spots like your billing counter, entrance, tables, or receipts.",
    },
    {
      question: "Collect Customer Feedback",
      answer:
        "Customers scan the QR code and submit their reviews. Positive reviews are automatically posted online. Negative reviews are sent privately to your dashboard to help improve your business.",
    },
    {
      question: "Monitor Reviews & Take Action",
      answer:
        "Login to your dashboard anytime to track customer feedback. Address negative feedback to improve your services.",
    },
];
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userNumber = localStorage.getItem("userNumber");
  const [activeSection, setActiveSection] = useState("FAQ");
  const [openIndex, setOpenIndex] = useState(null);
  const [openIndex1, setOpenIndex1] = useState(null);
  const [openIndex2, setOpenIndex2] = useState(null);
  const [openIndex3, setOpenIndex3] = useState(null);
  const [name, setname] = useState(userName);
  const [email, setemail] = useState(userEmail);
  const [comment, setcomment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(userNumber);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketID, setTicketID] = useState(null); // To store the ticket ID
  const [popname, setpopname] = useState(userName);
  const ticketsPerPage = 4;

  const [activeStatus, setActiveStatus] = useState("ALL");
  const userId = sessionStorage.getItem("id");
  // console.log(userId)

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const helpdeskData = {
      phoneNumber,
      name,
      email,
      comment,
      user_id: userId,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axiosInstance.post(
        "/users-help-center",
        helpdeskData
        // {
        //   headers: { "Content-Type": "application/json" },
        // }
      );

      if (response.status === 200) {
        const submittedTicket = response.data.userHelpDesk; // Get the latest ticket
        // console.log(submittedTicket);
        setTicketID(submittedTicket?.helpdesk_id || "N/A"); // Store Ticket ID
     
        setShowSuccessModal(true); // Show success modal
        setPhoneNumber("");
        setname("");
        setcomment("");
        setemail("")
      } else {
        setShowErrorModal(true); // Show error modal
      }
    } catch (error) {
      console.error("Submission error:", error);
      setShowErrorModal(true);
    }
  };

  const apiUrls = {
    ALL: `/users/${userId}/helpdesk`,
    OPEN: `/users/${userId}/helpdesk?status=OPEN`,
    IN_PROGRESS:
      `/users/${userId}/helpdesk?status=IN_PROGRESS`,
    CLOSED:
      `/users/${userId}/helpdesk?status=RESOLVED`,
  };

  useEffect(() => {
    fetchData(activeStatus);
  }, [activeStatus]);

  const fetchData = async (status) => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axiosInstance.get(apiUrls[status]);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching
    }
  };
  const resolvedTicketsCount = tickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "resolved"
  ).length;

  const activeTicketsCount = tickets.length - resolvedTicketsCount;

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const toggleFAQ1 = (index) => {
    setOpenIndex1((prevIndex) => (prevIndex === index ? null : index));
  };
  const toggleFAQ2 = (index) => {
    setOpenIndex2(openIndex2 === index ? null : index);
  };
  const toggleFAQ3 = (index) => {
    setOpenIndex3(openIndex3 === index ? null : index);
  };

  return (
    <div>
  
      <div className="container mx-auto lg:mt-32 mt-28 pb-8">
      <div className="w-[90%] mx-auto ">
        <div className=' bg-[#032068] bg-center flex flex-col items-center justify-center space-y-5 lg:p-8 p-4 text-white mt-10 rounded-md'>
          <h1 className=" md:text-lg text-base ">
            Welcome To Your Help Center
          </h1>
          <h1 className="md:text-base text-sm">
            Explore Your FAQ Questions To Quickly to Find Answers You Need
          </h1>
          {/* <input type="text" className=' w-64 h-10 rounded-full text-black px-4' placeholder="Search FAQs..." /> */}
          <h1>Get answers to common questions about managing your subscription, troubleshooting issues, and using the platform effectively</h1>
        </div>
        <div className="w-full lg:mt-10 mt-5">
          <div className="flex rounded-full ">
            <div className="border flex px-3 py-2 rounded-full ">
              <button
                className={`px-3 py-1  rounded-full flex items-center ${
                  activeSection === "FAQ"
                    ? "bg-gradient-to-r from-[#313860] to-[#151928] text-white"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveSection("FAQ")}
              >
                <span className="lg:text-base text-sm">FAQ</span>
                <span>
                  <LuShieldQuestion />
                </span>
              </button>
              <button
                className={`px-3 py-1  rounded-full flex items-center gap-1  ${
                  activeSection === "My Tickets"
                    ? "bg-gradient-to-r from-[#313860] to-[#151928] text-white"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveSection("My Tickets")}
              >
                <span className="md:text-base text-sm"> My Tickets</span>
                <span>
                  <LuTicket />
                </span>
              </button>
            </div>
          </div>
          {activeSection === "FAQ" && (
            <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-5 lg:mt-10 mt-5">
              <div className=" bg-[#FCF6FF] border border-[#E1A4FF] lg:p-6 p-4 rounded-xl mx-auto w-full">
                <h2 className="md:text-xl text-base  font-bold mb-2 ">
                  Getting Started
                </h2>
              
                <div>
                  {faqData1.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-[#E1A4FF] py-3 mt-3"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer "
                        onClick={() => toggleFAQ(index)}
                      >
                        <span className="font-semibold md:text-base text-sm">
                          {item.question}
                        </span>
                        <motion.button
                          animate={{ rotate: openIndex === index ? 90 : 0 }} // Rotates + and X icon smoothly
                          transition={{ duration: 0.3 }}
                          className="text-lg font-bold"
                        >
                          {openIndex === index ? (
                            <IoMdClose className="text-3xl border border-[#E1A4FF] w-8 h-8 rounded-full p-1" />
                          ) : (
                            <IoMdAdd className="text-3xl border border-[#E1A4FF] w-8 h-8 rounded-full p-1 " />
                          )}
                        </motion.button>
                      </div>
                      {openIndex === index && (
                        <motion.div
                          initial={{ maxHeight: 0, opacity: 0 }}
                          animate={
                            openIndex === index
                              ? { maxHeight: 200, opacity: 1 }
                              : { maxHeight: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-700 md:text-sm text-xs  mt-2">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className=" bg-[#FFF8F5] border border-[#FFC6AD] lg:p-6 p-4 rounded-xl mx-auto w-full">
                <h2 className="md:text-xl text-base  font-bold mb-2 ">
                Managing Your Subscription
                </h2>
                
                <div>
                  {faqData2.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-[#FFC6AD] py-3 mt-3"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer "
                        onClick={() => toggleFAQ1(index)}
                      >
                        <span className="font-semibold md:text-base text-sm">
                          {item.question}
                        </span>
                        <motion.button
                          animate={{ rotate: openIndex1 === index ? 90 : 0 }} // Rotates + and X icon smoothly
                          transition={{ duration: 0.3 }}
                          className="text-lg font-bold"
                        >
                          {openIndex1 === index ? (
                            <IoMdClose className="text-3xl border border-[#FFC6AD] w-8 h-8 rounded-full p-1" />
                          ) : (
                            <IoMdAdd className="text-3xl border border-[#FFC6AD] w-8 h-8 rounded-full p-1 " />
                          )}
                        </motion.button>
                      </div>
                      {openIndex1 === index && (
                        <motion.div
                          initial={{ maxHeight: 0, opacity: 0 }}
                          animate={
                            openIndex1 === index
                              ? { maxHeight: 200, opacity: 1 }
                              : { maxHeight: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-700 md:text-sm text-xs mt-2">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className=" text-lg  font-medium">
                <div className=" bg-[#E3FFE7] border border-[#14BA6D] lg:p-6 p-4 rounded-xl mx-auto">
                  <h2 className="md:text-xl text-base font-bold mb-2">
                  Troubleshooting
                  </h2>
                  
                  <div>
                    {faqData3.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-[#14BA6D] py-3 mt-3"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer "
                          onClick={() => toggleFAQ2(index)}
                        >
                          <span className="font-semibold md:text-base text-sm">
                            {item.question}
                          </span>
                          <motion.button
                            animate={{ rotate: openIndex2 === index ? 90 : 0 }} // Rotates + and X icon smoothly
                            transition={{ duration: 0.3 }}
                            className="text-lg font-bold"
                          >
                            {openIndex2 === index ? (
                              <IoMdClose className="text-3xl border border-[#14BA6D] w-8 h-8 rounded-full p-1" />
                            ) : (
                              <IoMdAdd className="text-3xl border border-[#14BA6D] w-8 h-8 rounded-full p-1 " />
                            )}
                          </motion.button>
                        </div>
                        {openIndex2 === index && (
                          <motion.div
                            initial={{ maxHeight: 0, opacity: 0 }}
                            animate={
                              openIndex2 === index
                                ? { maxHeight: 200, opacity: 1 }
                                : { maxHeight: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-700 md:text-sm text-xs mt-2">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className=" text-lg  font-medium">
                <div className=" bg-[#EAEDFF] border border-[#899BFF] lg:p-6 p-4 rounded-xl mx-auto ">
                  <h2 className="md:text-xl text-base font-bold mb-2">
                  How to Use?
                  </h2>
                  
                  <div>
                    {faqData4.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-[#899BFF] py-3 mt-3"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer "
                          onClick={() => toggleFAQ3(index)}
                        >
                          <span className="font-semibold md:text-base text-sm">
                            {item.question}
                          </span>
                          <motion.button
                            animate={{ rotate: openIndex3 === index ? 90 : 0 }} // Rotates + and X icon smoothly
                            transition={{ duration: 0.3 }}
                            className="text-lg font-bold"
                          >
                            {openIndex3 === index ? (
                              <IoMdClose className="text-3xl border border-[#899BFF] w-8 h-8 rounded-full p-1" />
                            ) : (
                              <IoMdAdd className="text-3xl border border-[#899BFF] w-8 h-8 rounded-full p-1 " />
                            )}
                          </motion.button>
                        </div>
                        {openIndex3 === index && (
                          <motion.div
                            initial={{ maxHeight: 0, opacity: 0 }}
                            animate={
                              openIndex3 === index
                                ? { maxHeight: 200, opacity: 1 }
                                : { maxHeight: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-700 md:text-sm text-xs mt-2">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "My Tickets" && (
            <div>
              <div className="grid lg:grid-cols-3 items-start grid-cols-1 lg:gap-5 space-y-5 lg:space-y-0 mt-5">
                <div className="grid col-span-2   w-full">
                  <div className="flex   w-full ">
                    {[
                      { status: "ALL", icon: <CiMail /> },
                      { status: "OPEN", icon: <IoMailUnreadOutline /> },

                      { status: "IN_PROGRESS", icon: <RiMailSendLine /> },
                      { status: "CLOSED", icon: <RiMailCheckLine /> },
                    ].map(({ status, icon }) => (
                      <h1
                        key={status}
                        className={`cursor-pointer md:text-base text-xs pb-2 mb-3 w-full flex items-center capitalize justify-center  relative ${
                          activeStatus === status
                            ? "text-[#032068]"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveStatus(status)}
                      >
                        <p className="flex items-center gap-1">
                          <span className="hidden md:block">{icon}</span>
                          {status.replace("_", " ")}
                        </p>
                        {/* Underline Effect */}
                        <span
                          className={`absolute bottom-0 left-0 w-full h-[3px] transition-all ${
                            activeStatus === status
                              ? "bg-[#032068]"
                              : "bg-gray-300"
                          }`}
                        ></span>
                      </h1>
                    ))}
                  </div>

                  {loading && <div className="h-[300px] flex items-center justify-center text-black font-semibold ">Loading tickets...
                   
                    </div>}
                  {error && <p className="text-red-500">{error}</p>}

                  {!loading && !error && tickets.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-5 w-full border">
                     <p className=" flex items-center justify-center font-semibold text-red-600   rounded-md " >No tickets found..</p>
                     <img src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/12079893_4905858.svg?updatedAt=1741541774413" className="w-[250px] h-[250px] object-cover" alt="" />
                   </div>
                  )}

                  {!loading && !error && tickets.length > 0 && (
                    <ul className="space-y-4">
                      {currentTickets.map((ticket) => (
                        <div
                          key={ticket.helpdesk_id}
                          className="border border-[#E7E7E7] p-3 space-y-2 rounded "
                        >
                          <div className="w-full flex justify-between   ">
                            <h2 className="font-semibold  my-2 ">
                              {" "}
                              <span>Ticket ID: #</span>
                              {ticket.helpdesk_id}
                            </h2>
                            <h1 className=" my-2 text-gray-600 flex gap-1">
                              <span className="hidden lg:block">
                                Posted at:
                              </span>{" "}
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </h1>
                          </div>
                          <div className="flex flex-col ">
                            <h1 className="font-semibold">Comment:</h1>
                            <h1> {ticket.comment}</h1>
                          </div>
                          <h1 className="border-b pb-[1px]">
                            <strong>Phone:</strong> {ticket.phoneNumber}
                          </h1>

                          <div className="flex justify-between">
                            <div className="flex gap-1 items-center">
                              <img
                                src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/People%20(2).png?updatedAt=1741541954851"
                                className="w-8"
                                alt=""
                              />
                              <h1 className="text-gray-500">{ticket.name}</h1>
                            </div>
                            <div className="flex">
                              <h1
                                className={` font-semibold ${
                                  ticket.status === "OPEN"
                                    ? "text-red-500"
                                    : ticket.status === "IN_PROGRESS"
                                    ? "text-yellow-500"
                                    : ticket.status === "RESOLVED"
                                    ? "text-green-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {ticket.status}
                              </h1>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center mt-4">
                    {/* Prev Button */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded ${
                        currentPage === 1 ? "text-black" : "text-gray-500"
                      }`}
                    >
                      Prev
                    </button>

                    {/* Page Numbers with Dynamic Background Color */}
                    <p className="text-lg flex gap-4">
                      <span
                        className={`border border-[#032068] w-full px-3 py-1 text-center transition ${
                          currentPage > 1
                            ? "bg-[#032068] text-white"
                            : "bg-transparent"
                        }`}
                      >
                        {currentPage}
                      </span>

                      <span
                        className={` border border-[#032068] w-full px-3 py-1 text-center transition ${
                          currentPage >=
                          Math.ceil(tickets.length / ticketsPerPage)
                            ? "bg-[#032068] text-white"
                            : "bg-transparent"
                        }`}
                      >
                        {Math.ceil(tickets.length / ticketsPerPage)}
                      </span>
                    </p>

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(tickets.length / ticketsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(tickets.length / ticketsPerPage)
                      }
                      className={`px-4 py-2 rounded ${
                        currentPage >=
                        Math.ceil(tickets.length / ticketsPerPage)
                          ? "text-black"
                          : "text-gray-500"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className=" grid col-span-1   h-full  w-full  p-4 bg-white border space-y-3 rounded-lg ">
                  <div className="">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Create Quick Ticket
                    </h2>
                    <p className="text-gray-500 text-sm ">
                      Write and address new queries and issues
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium">
                          Customer Name
                        </label>
                        <input
                          type="name"
                          name="name"
                          value={userName}
                          onChange={(e) => setname(e.target.value)}
                          placeholder="Type your name"
                          className="w-full mt-1 p-2 border opacity-50 border-gray-300 rounded-md focus:outline-none"
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium">
                          Customer Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={userEmail}
                          onChange={(e) => setemail(e.target.value)}
                          placeholder="Type your name"
                          className="w-full mt-1 p-2 border opacity-50 border-gray-300 rounded-md focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={userNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full mt-1 p-2 opacity-50 border border-gray-300 rounded-md focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium">
                          Ticket Body
                        </label>
                        <textarea
                          name="comment"
                          value={comment}
                          onChange={(e) => setcomment(e.target.value)}
                          placeholder="Type ticket issue here.."
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none"
                          rows={4}
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#313860] to-[#151928] text-white p-2 rounded-md  transition"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <div className="p-4 border rounded-lg w-full    bg-white">
                    <h2 className="text-lg font-semibold mb-4">
                      Admin Referral Key Metrics
                    </h2>

                    <div className="mb-4 flex items-center justify-between p-4 bg-gray-100">
                      <div>
                        <p className="text-sm text-gray-600">Total tickets</p>
                        <p className="text-2xl font-bold">{tickets.length}</p>
                      </div>
                      <BsChatHeart className="w-8 h-8 text-white bg-[#032068] p-2 rounded-lg" />
                    </div>

                    <div className="grid grid-cols-2 items-center justify-between gap-2 ">
                      <div className="flex items-center gap-2 justify-between w-full border border-red-500 bg-red-100 rounded-md p-2">
                        <div>
                          <p className=" text-gray-600 lg:text-sm text-xs">
                            Open Tickets
                          </p>
                          <p className="lg:text-2xl text-xl font-bold">
                            {activeTicketsCount}
                          </p>
                        </div>
                        <MdOutlinePendingActions className="w-8 h-8 text-white bg-red-500 p-2 rounded-lg" />
                      </div>
                      <div className="flex items-center gap-2 justify-between w-full border rounded-md border-green-500 bg-green-100 p-2">
                        <div>
                          <p className="lg:text-sm text-xs text-gray-600">
                            Closed Tickets
                          </p>
                          <p className="lg:text-2xl text-xl font-bold">
                            {resolvedTicketsCount}
                          </p>
                        </div>
                        <MdDomainVerification className="w-8 h-8 text-white bg-green-500 p-2 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

         
        </div>
        <div className=" mt-10 space-y-4">
          <h1 className="text-lg font-semibold">Contact Us</h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2  grid-cols-1 gap-4  ">
            {/* <div className="border  flex items-center rounded-md lg:justify-center gap-2 p-4">
              <p className="text-[#032068]">
                <FaPhoneAlt />
              </p>
              <a href="tel:9015182615">+91 9150182615</a>
            </div> */}
            <div className="border border-[#E5EFFF] rounded-md flex items-center lg:justify-center gap-2 p-4">
              <p className="text-xl text-[#032068]">
                <IoMail />
              </p>
              <a href="mailto:thelogicqr@gmail.com">thelogicqr@gmail.com</a>
            </div>

            <div className="border border-[#E5EFFF] flex rounded-md items-center lg:justify-center gap-2 p-4">
              <p className="text-xl text-[#032068]">
                <TbWorld />
              </p>
              <a
                href="https://www.logicqr.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.logicqr.com
              </a>
            </div>
            <div className="border border-[#E5EFFF] rounded-md lg:justify-center flex items-center gap-2  p-4">
              <p className="text-xl text-[#032068]">
                <FaLocationDot />
              </p>
              <a href="tel:9015182615">velachery chennai,600042</a>
            </div>
          </div>
        </div>

        <div className=" mt-5 space-y-4">
          <h1 className="text-lg font-semibold">Follow Us On </h1>
          <div className="flex gap-5">
      <a
        href="https://www.linkedin.com/in/webzspot/"
        target="_blank"
        rel="noopener noreferrer"
        className="border border-[#F7FAFF] bg-[#F7FAFF] w-8 h-8 flex items-center justify-center rounded-full p-1 text-[#032068] hover:bg-[#032068] hover:text-white transition"
      >
        <RiLinkedinFill />
      </a>
      <a
        href="https://www.instagram.com/webzspot/?next=%2F"
        target="_blank"
        rel="noopener noreferrer"
        className="border border-[#F7FAFF] bg-[#F7FAFF] w-8 h-8 flex items-center justify-center rounded-full p-1 text-[#032068] hover:bg-[#032068] hover:text-white transition"
      >
        <RiInstagramLine />
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=61565656703377"
        target="_blank"
        rel="noopener noreferrer"
        className="border border-[#F7FAFF] bg-[#F7FAFF] w-8 h-8 flex items-center justify-center rounded-full p-1 text-[#032068] hover:bg-[#032068] hover:text-white transition"
      >
        <FaFacebookF />
      </a>
    </div>
        </div>
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center min-h-screen justify-center bg-black bg-opacity-50 p-4 z-30 ">
            <div className="bg-white lg:w-[30%]  space-y-2  px-5 text-center lg:py-6 pb-4 rounded-md shadow-md  ">
              <img
                src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/business-tasklist.png?updatedAt=1741522963956"
                alt="Success"
                className=" w-64 mx-auto mb-2"
              />
              <div className="flex justify-center w-[50px] h-[50px] rounded-full border border-green-500 p-2 mx-auto items-center ">
              <lord-icon
              src="https://cdn.lordicon.com/hrtsficn.json"
              trigger="in"
              delay=""
              state="in-reveal"
              colors="primary:#30e849"
              style={{ width: "100%", height: "100%" }}
              >
              </lord-icon>
              </div>
              <h2 className="text-green-600 text-center font-semibold text-lg">
                Ticket Raised Successfully!
              </h2>
              <h1>Hi {popname},</h1>
              <p className="text-gray-600">
                Your request has been submitted. TicketID : {ticketID} <br /> Our team
                will get back to you shortly. <br />
              </p>
              <div className="">
                <p className="font-semibold">Thanks</p>
                <p>Team Webzspot</p>
              </div>
              <div className="flex justify-between ">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-[#032068] w-full py-2 text-white rounded-md  transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <lord-icon
                src="https://cdn.lordicon.com/azxkyjta.json"
                trigger="in"
                delay="500"
                state="in-reveal"
                style={{ width: "60px", height: "60px" }}
              ></lord-icon>
              <h2 className="text-red-600 font-semibold text-lg">
                Submission Failed
              </h2>
              <p className="text-gray-600">
                There was an error submitting your request.
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Help;