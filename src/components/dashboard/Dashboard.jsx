import React, { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import { FiLink } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosStar, IoIosTrash } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { RxCopy } from "react-icons/rx";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomPieChart from "./CustomPieChart";
import ReviewCharts from "./ReviewCharts";
import { CgComment } from "react-icons/cg";
import { TbHomeStats } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { BsCheckLg } from "react-icons/bs";
import { FiThumbsUp } from "react-icons/fi";
import {MdOutlineWavingHand} from "react-icons/md"
import axiosInstance from "../auth/axios";
import { MONTHLY, ANNUAL } from "../../data/site";

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

/** Loaded on demand, not on every page of the site. */
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [qr, setQr] = useState("");
  const qrCodeRef = useRef(); // Ref to access the QR code canvas
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setpopup] = useState(false);
  // const [userId,setUserId] = useState('')
  const userId = sessionStorage.getItem("id");
  const [paying, setPaying] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewPages, setReviewPages] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };


  const confirmDelete = async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      // console.log("Deleting review with ID:", selectedId);

      const response = await axiosInstance.delete(`/review-entry/${selectedId}`);

      // const text = await response.text();
      // console.log("Raw API Response:", text);
      // console.log('response.data',response.data)

      if (response.status===200) {
        // console.log("Review deleted successfully");
        fetchDashboardData()
        setShowSuccess(true); // Show success message
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      // The `finally` block used to set the success flag unconditionally, so a
      // failed delete still reported "deleted successfully".
      toast.error(error.message || "Could not hide that feedback.");
    } finally {
      setLoading(false);
      setSelectedId(null);
      setShowConfirm(false);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  /**
   * The dashboard payload is `{ state, user, reviewUrl, stats, recentFeedback }`
   * now. `stats` reports what is actually measurable: how much private feedback
   * arrived, how many scans went to Google, and what share of scans that was.
   *
   * The old shape carried a "positiveReviewPercentage" that was not a
   * percentage and did not count positive reviews at all.
   */
  const fetchDashboardData = async () => {
    try {
      const data = await axiosInstance
        .get("/my/dashboard")
        .then((r) => r.data);

      if (data.state === "INACTIVE") {
        setpopup(true);
        setUserData(data);
        return;
      }

      setUserData(data);

      // Reviews are paginated separately rather than every one arriving with
      // the dashboard.
      const list = await axiosInstance
        .get("/my/reviews", { params: { limit: reviewsPerPage, page: currentPage } })
        .then((r) => r.data);
      setReviews(list?.items ?? []);
      setReviewPages(list?.pages ?? 1);
      setReviewTotal(list?.total ?? 0);

      if (data.reviewUrl) {
        setQr(`https://www.logicqr.com${data.reviewUrl}`);
      }
    } catch (err) {
      setError(err.message || "Could not load your dashboard.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refetch when the page changes, since the list is server-paginated now.
  }, [userId, currentPage]);

  /**
   * Brings a lapsed account back.
   *
   * Sets up a new recurring mandate rather than taking a single payment that
   * would lapse again in a month — and the account comes from the session, not
   * from a `user_id` in the request body as it did before.
   */
  const restartSubscription = async () => {
    setPaying(true);

    try {
      const ready = await loadRazorpay();
      if (!ready) throw new Error("Could not open the payment window. Check your connection.");

      const start = await axiosInstance
        .post("/my/subscription/restart", { cycle: "monthly" })
        .then((r) => r.data);

      const rzp = new window.Razorpay({
        key: start.keyId,
        subscription_id: start.subscriptionId,
        name: "LogicQR",
        description: "Restart your review page",
        prefill: start.prefill,
        theme: { color: "#13B8CF" },
        handler: async (response) => {
          try {
            await axiosInstance.post("/my/subscription/restart/confirm", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            });
            setpopup(false);
            await fetchDashboardData();
            toast.success("Your review page is live again.");
          } catch (err) {
            // Never claim success on the gateway callback alone.
            toast.error(
              err.message ||
                "Payment went through but we could not finish. Email thelogicqr@gmail.com and we will sort it out."
            );
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      rzp.open();
    } catch (error) {
      toast.error(error.message || "Could not start the payment.");
      setPaying(false);
    }
  };

  const handleCopy = () => {
    // console.log("QR value:", qr, typeof qr); // Log to check if it's a string or object

    if (!qr) {
      toast.error("copied sucessfully");
      return;
    }

    const linkToCopy = typeof qr === "string" ? qr : qr?.url; // Try accessing qr.url
    // console.log("Copying:", linkToCopy); // Log what we are copying

    if (!linkToCopy) {
      toast.error("Invalid link. Nothing copied.");
      return;
    }

    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => toast.success("Link copied successfully!"))
      .catch(() => toast.error("Failed to copy link."));
  };
  const handleDownloadQR = () => {
    try {
      const qrCanvas = qrCodeRef.current.querySelector("canvas");
      const qrImage = new Image();
      qrImage.src = qrCanvas.toDataURL("image/png");

      qrImage.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = 800;
        canvas.height = 1200;
        await document.fonts.ready;

        // Background Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#ffffff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "50px 'Poppins', serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";

        // Draw the text on the canvas
        ctx.fillText("Scan the QR Code and", canvas.width / 2, 80);

        // Header: "Review us on Google"
        ctx.font = "bold 85px 'Poppins', serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText("Review us on", canvas.width / 2, 180);

        // Google Logo
        const googleLogoImage = new Image();
        googleLogoImage.crossOrigin = "anonymous";
        googleLogoImage.src =
          "https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/Reviewpage?updatedAt=1741523037514";

        googleLogoImage.onload = () => {
          const logoWidth = 300;
          const logoHeight = 180;
          const startX = (canvas.width - logoWidth) / 2;
          const logoY = 190;

          // Draw Google logo
          ctx.drawImage(googleLogoImage, startX, logoY, logoWidth, logoHeight);

          // QR Code Section
          const qrSize = 400;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 400;

          ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

          // Stars Section
          ctx.font = "bold 80px Arial"; // Larger stars
          ctx.fillStyle = "#FFD700"; // Gold color
          const starCount = 5;
          const starGap = 90; // Increased gap between stars
          const totalStarsWidth = (starCount - 1) * starGap;
          const starX = (canvas.width - totalStarsWidth) / 2;

          for (let i = 0; i < starCount; i++) {
            ctx.fillText("★", starX + i * starGap, qrY + qrSize + 120);
          }

          // Business Name
          const businessName = userData.user.businessName;
          ctx.font = "bold 50px Arial";
          ctx.fillStyle = "#4385f5";
          ctx.fillText(businessName, canvas.width / 2, qrY + qrSize + 210);

          // Website URL
          ctx.font = "28px Arial";
          ctx.fillStyle = "#000000";
          ctx.fillText("www.logicqr.com", canvas.width / 2, qrY + qrSize + 300);

          ctx.font = "12px Arial";
          ctx.fillStyle = "#21211f";
          ctx.fillText(
            "All rights reserved webzspot.com",
            canvas.width / 2,
            qrY + qrSize + 360
          );

          // Generate the PDF
          const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]);
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Download the PDF
          pdf.save("google-review.pdf");
          toast.success("QR Code downloaded successfully!");
        };
      };
    } catch (err) {
      toast.error("Failed to download QR Code.");
    }
  };
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Recent Reviews", 10, 10);
    doc.autoTable({
      head: [["Reviewer", "Review Text", "Date"]],
      body: filteredReviews.map((review) => [
        review.userName,
        review.comment,
        new Date(review.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("reviews.pdf");
    toast.success("QR Code downloaded successfully!");
  };

  /**
   * The current page of feedback, filtered client-side within that page.
   * The whole set used to be downloaded and paginated in the browser, which
   * does not scale past a few hundred reviews.
   */
  const filteredReviews = (reviews || []).filter((review) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      review?.name?.toLowerCase().includes(q) || review?.comment?.toLowerCase().includes(q)
    );
  });

  // Reset to the first page when searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // The server already returned one page, so this is that page.
  const currentReviews = filteredReviews;
  const totalPages = reviewPages;

  if (error) {
    return <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Error Loading Data
      </h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  </div>;
  }

  if (!userData && !popup) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
          <div className="md:hidden flex gap-8 w-full justify-center">
            {/* Left Box */}
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg bg-gray-200 animate-pulse" />

            {/* Right Box */}
            <div className="w-48 h-48 hidden md:block md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="flex gap-8 w-full justify-center">
            {/* Left Box */}
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg bg-gray-200 animate-pulse" />

            {/* Right Box */}
            <div className="w-48 h-48 hidden md:block md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg bg-gray-200 animate-pulse" />
          </div>

          {/* Horizontal Lines */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="h-5 bg-gray-200 rounded w-60 md:w-72 lg:w-80 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-72 md:w-80 lg:w-96 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-64 md:w-72 lg:w-84 animate-pulse" />
          </div>
        </div>
      </div>

    );
  }

  return (
    <div>
   
      <div className="container mx-auto min-h-screen lg:mt-32 mt-28">
      <ToastContainer position="top-right" autoClose={3000} />
      {popup && (
        <div className="fixed inset-0 mt-20 flex justify-center items-center bg-black bg-opacity-50 z-30  ">
          <div className=" lg:max-w-sm  max-w-md  shadow-lg  text-center relative m-5  ">
            <div className="bg-white rounded-xl lg:px-8 px-5 py-6 ">
              <div className="flex justify-center  ">
                <div className="h-36  w-full">
                  <img
                    src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/popup%20img?updatedAt=1741523123558"
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
                  Hi {userData.userName || "N/A"} ;{" "}
                </span>
                <br />
                <span className="md:text-sm text-xs ">
                  Your subscription for{" "}
                  <span className="font-semibold">
                    {userData.businessName || "N/A"}
                  </span>{" "}
                  has expired. Renew now to restore your service.{" "}
                </span>
              </p>

              <p className="text-left text-gray-600 md:text-sm text-xs mt-2">
                <span className="md:text-sm text-xs font-semibold">
                  Thanks,
                </span>
                <br />
                Team LogicQR
              </p>

              <div className="bg-gray-50 border rounded-lg px-4 py-2 mt-2">
                <p className="text-2xl font-bold text-[#121417] ">
                  <span className="md:text-sm text-xs">{MONTHLY} </span>
                  <span className="md:text-sm text-xs font-normal text-gray-500">
                     / month, or {ANNUAL} / year
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
                <button className=" w-full bg-[#121417] text-white font-semibold py-2 md:text-sm text-xs rounded-md" onClick={restartSubscription}>
                {paying ? 'Opening payment…' : 'Restart my page'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 w-[90%] mx-auto mt-10 py-2">
          <div className="col-span-1 border-blue-900 lg:border-l-4 lg:p-3 rounded-md lg:bg-gray-100">
            <div
              className="relative z-10  bg-cover bg-center rounded-2xl  overflow-hidden flex items-center lg:p-6 p-4 h-[297px] w-full"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/pds5n5l6d3/LogicQR/User%20section/brooke-cagle-g1Kr4Ozfoac-unsplash%201.png?updatedAt=1741541774251')",
              }}
            >
              {/* Purple Overlay */}
              <div className="absolute  inset-0 bg-gradient-to-r from-[#2A2D33] to-[#121417] opacity-60"></div>

              {/* Content Section */}
              <div className="relative text-white  w-full h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-semibold">
                    Welcome {userData?.user?.name || "Guest"}{" "}

                  </h2>
                  <span className="text-lg md:text-2xl"><MdOutlineWavingHand /></span>
                  </div>
                  <p className="text-sm md:text-base lg:w-[80%] opacity-90">
                    {/* A typing animation on a sentence the owner reads every
                        visit is a delay, not a flourish — and it pulled in a
                        whole dependency. Plain text. */}
                    Your dashboard is ready. Every piece of private feedback lands here, and the QR code below is
                    what collects it.
                  </p>
                </div>
                <div>
                  <a href="#" className="text-white font-semibold mt-2  text-sm ">
                    Here your Insights
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 ">
            {qr && (
              <div className="bg-gray-100 rounded-md flex flex-col gap-3  md:gap-6 lg:px-4 lg:py-2 border-blue-900 lg:border-l-4 border-t-4 lg:border-t-0  text-center lg:text-left w-full ">
                {/* QR Code Section */}
                <div className="flex w-full gap-2 lg:gap-4 py-1 px-2 lg:p-0 items-center">
                  <div className="w-auto flex flex-col items-center ">
                    <div
                      className="p-2 bg-[#] rounded-lg w-full flex justify-center lg:w-auto shadow-sm"
                      ref={qrCodeRef}
                    >
                      <QRCodeCanvas
                        value={qr}
                        size={140}
                        className="rounded-md"
                        level="H"
                      />
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="w-full  flex flex-col ">
                    <div className="flex items-end lg:justify-end justify-center w-full">
                      <span className="bg-green-600 text-white text-[10px] md:text-sm  lg:px-4 px-2 lg:py-1  mb-1 rounded-full  ">
                        Primary
                      </span>
                    </div>
                    <div className=" flex flex-col items-center lg:items-start justify-start ">
                      <div className="flex gap-1 flex-col lg:flex-row lg:items-center ">
                        <h2 className="md:text-lg text-sm  font-semibold">
                          Business Name:
                        </h2>
                        <h2 className="md:text-lg text-sm text-center  ">
                          {userData?.user?.businessName || "N/A"}{" "}
                        </h2>
                      </div>
                      <p className="text-gray-700 hidden md:block ">
                        Let guests scan this QR code to share their experience
                        instantly!
                      </p>
                      <div className="mt-4 lg:hidden flex items-center justify-end gap-3 w-full lg:w-auto">
                        <button
                          onClick={handleDownloadQR}
                          className="border w-full lg:w-auto border-gray-300 bg-[#121417] text-white flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
                        >
                          Download
                          <MdOutlineFileDownload />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4  hidden lg:flex items-center justify-end gap-3 w-full lg:w-auto">
                      <button
                        onClick={handleDownloadQR}
                        className="border w-full lg:w-auto border-gray-300 bg-[#121417] text-white flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm "
                      >
                        Download
                        <MdOutlineFileDownload />
                      </button>
                    </div>
                    {/* Form Link Section */}
                  </div>
                </div>
                <div className=" flex flex-col  gap-3 items-start  w-full border   text-white bg-gradient-to-r from-[#2A2D33] to-[#121417] border-gray-200 px-2 py-2 rounded-md ">
                  <div className="w-full">
                    <div className="  flex items-center  gap-2  text-white w-full">
                      <h1 className="flex  items-center gap-1">
                        <FaRegAddressCard className="text-lg " />{" "}
                        <span className="font-semibold   text-white">
                          Form Name:{" "}
                        </span>{" "}
                      </h1>
                      <h1 className="   lg:mt-0   rounded-lg  ">
                        <span className=" font-semibold text-center">
                          {userData?.user?.businessName || "n/a"}
                        </span>
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <h1 className="flex items-start justify-start gap-2 ">
                      <FiLink className="text-lg " />{" "}
                      <span className="">Form Link:</span>
                    </h1>
                    <h1 className="flex items-center gap-3 break-all bg-gray-50 p-3 rounded-lg shadow-inner">
                      <a
                        href={qr}
                        className="text-blue-600 break-all  hover:underline "
                      >
                        {qr}
                      </a>
                      <span
                        onClick={handleCopy}
                        className="cursor-pointer text-gray-700 hover:text-gray-900"
                      >
                        <RxCopy className="text-lg" />
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" grid lg:grid-cols-2 lg:w-[90%] mx-auto lg:mt-8  grid-cols-1 ">
          <div className="lg:grid col-span-1  hidden">
            {" "}
            <ReviewCharts stats={userData?.stats} />
          </div>
          <div className="grid col-span-1 ">
            {" "}
            <CustomPieChart stats={userData?.stats} />
          </div>
        </div>

      <div>
        {/* Reviews Section */}
        <div className="bg-white rounded-md md:py-6 mt-4 lg:mt-6 w-[90%] mx-auto">
          {/* Header Section */}
          <div className="flex lg:justify-between flex-col lg:flex-row lg:items-center gap-4 p-2 lg:p-0 pb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Reviews{" "}
                <span className="text-blue-500 border border-[#087889] bg-sky-50 rounded-full px-2 text-xs">
                  {currentReviews.length}
                </span>
              </h2>
              <h2 className="text-sm">Latest Reviews overviews</h2>
            </div>
            <div className="flex space-x-3 items-center">
              <input
                type="text"
                className="w-96 h-10 border focus:outline-none rounded-md border-gray-400 p-2"
                value={searchQuery}
                placeholder="Search Here ..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-gradient-to-r from-[#2A2D33] to-[#121417] text-white lg:px-4 px-3 h-10 lg:py-1 flex items-center gap-2 rounded-md text-sm lg:text-base"
                onClick={exportPDF}
              >
                <span className="md:block hidden">Export</span>{" "}
                <span className="lg:text-xl text-base">
                  <FiUploadCloud />
                </span>
              </button>
            </div>
          </div>
          {/* Table Section */}
          <div className="overflow-x-auto mx-auto mt-4 hidden lg:block">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3 text-gray-600 text-center">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-center">
                    Date of Review
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-center">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-center">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.length > 0 ? (
                  currentReviews.map((rev, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 text-center">
                        {rev.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 truncate max-w-xs text-center">
                        {rev.comment}
                      </td>
                      <td className="px-4 py-3 flex items-center space-x-1 justify-center">
                        <span className="ml-2 text-gray-600">
                          {rev.rating.toFixed(1) || "N/A"}
                        </span>
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {rev.rating >= i + 1 ? (
                              <span className="text-yellow-500">
                                <IoIosStar />
                              </span>
                            ) : (
                              <span className="text-gray-300">
                                <IoIosStarOutline />
                              </span>
                            )}
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-center">
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() => handleDeleteClick(rev.review_id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-green-500  text-lg"
                    >
                      No Reviews Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="lg:hidden block space-y-4 mt-4">
            {currentReviews.length > 0 ? (
              currentReviews.map((rev, index) => (
                <div
                  key={index}
                  className="p-3 relative border-t-4 border-[#121417] rounded-lg bg-white border  "
                >
                  <div className="text-end">
                    <p className="text-xs">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mb-4 flex items-center space-x-3">
                    <FaRegUserCircle className="text-[#121417] text-3xl" />
                    <div>
                      <p className="text-gray-500 text-sm">Reviewer</p>
                      <h3 className="text-gray-800 text-sm ">
                        {rev.name || "Unknown"}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center space-x-3">
                    <CgComment className="text-[#121417] text-3xl" />
                    <div>
                      <p className="text-gray-500 text-sm">Comment</p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {rev.comment || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center space-x-3">
                    <TbHomeStats className="text-[#121417] text-3xl" />
                    <div className="space-y-2">
                      <p className="text-gray-500 text-sm">Ratings</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) =>
                          rev.rating >= i + 1 ? (
                            <IoIosStar
                              key={i}
                              className="text-yellow-400 w-5 h-5 transition-transform duration-200 hover:scale-110"
                            />
                          ) : (
                            <IoIosStarOutline
                              key={i}
                              className="text-gray-300 w-5 h-5 transition-transform duration-200 hover:scale-110"
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex w-full border items-center py-2 rounded-md bg-gradient-to-r from-[#2A2D33] to-[#3c4977] justify-center text-gray-500 text-sm"
                    onClick={() => handleDeleteClick(rev.review_id)}
                  >
                    <p className="text-white text-lg">Delete</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-red-500 text-lg py-6">
                No Reviews Found
              </p>
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-3 pb-5">
            <button
              className={`${currentPage === 1 ? "text-black" : "text-gray-500"
                }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <p className="text-lg flex gap-4">
              <span
                className={`border border-[#121417] px-3 py-1 text-center transition ${currentPage > 1 ? "bg-[#121417] text-white" : "bg-transparent"
                  }`}
              >
                {currentPage}
              </span>
              <span
                className={`border border-[#121417] px-3 py-1 text-center transition ${currentPage >= totalPages
                    ? "bg-[#121417] text-white"
                    : "bg-transparent"
                  }`}
              >
                {totalPages}
              </span>
            </p>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-5">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-full flex items-center justify-center">
              <lord-icon
                src="https://cdn.lordicon.com/hwjcdycb.json"
                trigger="loop"
                delay="500"
                state="morph-trash-in"
                style={{ width: "70px", height: "70px" }}
              ></lord-icon>
            </div>
            <p className="text-lg mb-4">
              Are you sure you want to delete this review?
            </p>
            <div className="flex gap-5 w-full">
              <button
                className="px-4 py-2 w-full bg-gray-300 rounded"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded w-full"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-10 animate-fade-in">
          <div className="p-8 bg-white max-w-md w-[90%] lg:w-[30%] rounded-xl shadow-2xl transform transition-all">
            <div className="flex flex-col items-center gap-4">
              {/* Animated checkmark circle */}
              <div className="relative w-20 h-20 flex items-center justify-center">
              <lord-icon
              src="https://cdn.lordicon.com/hrtsficn.json"
              trigger="in"
              delay=""
              state="in-reveal"
              colors="primary:#1F8A4C"
              style={{ width: "100%", height: "100%" }}
              >
              </lord-icon>
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Success!</h3>
                <p className="text-green-500 font-medium">Review deleted successfully</p>
              </div>

              {/* Action button */}
              <button
              onClick={()=>setShowSuccess(false)}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                      transition-colors duration-200 font-medium transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Details */}
    </div>
    </div>
  );
}

export default Dashboard;