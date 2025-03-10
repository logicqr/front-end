import React, { useState, useEffect } from "react";
import Chart from '../staffDashboard/Chart'
import { BsFillCalendarDateFill } from "react-icons/bs";

// Icons
import { LuMessageCircleHeart } from "react-icons/lu";
import { BsClipboardCheck } from "react-icons/bs";
import { RiFileCloseLine } from "react-icons/ri";
import { FaUserAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaUser, FaStore, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdEmail, MdClose } from "react-icons/md";
import axiosInstance from "../../auth/axios";


const Dashboard = () => {
    const [referrals, setReferrals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showOverall, setShowOverall] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // const [isLoading, setIsLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState(null);
    const [apiError, setApiError] = useState("");
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);
    const itemsPerPage = 7;
    const id = sessionStorage.getItem("id")


    const isLoading = isLoadingReferrals || isLoadingEmployee;

    // Calculate metrics dynamically
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(
        (referral) => referral.isActive
    ).length;
    const inactiveReferrals = referrals.filter(
        (referral) => !referral.isActive
    ).length;
    const totalReferralFeeEarned = totalReferrals * 209;

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const getFilteredReferrals = () => {
        let filtered = referrals;

        if (searchTerm) {
            filtered = filtered.filter((referral) =>
                referral.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (!showOverall) {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            filtered = filtered.filter((referral) => {
                const referralDate = new Date(referral.createdAt);
                return (
                    referralDate.getMonth() === currentMonth &&
                    referralDate.getFullYear() === currentYear
                );
            });
        }

        return filtered;
    };

    const filteredReferrals = getFilteredReferrals();
    const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReferrals = filteredReferrals.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    useEffect(() => {
        setIsLoadingReferrals(true);
        axiosInstance.get(`/staff/${id}/referrals`)
        
            .then((response) => {
                // console.log(response)
                // Handle API structure properly
                if (response.data && Array.isArray(response.data.data)) {
                    setReferrals(response.data.data);
                } else {
                    setApiError(response.data?.message || "Failed to load referrals");
                }
            })
            .catch((error) => {
                setApiError("Failed to connect to the server. Please try again later.");
            })
            .finally(() => {
                setIsLoadingReferrals(false);
            });
    }, []);

    useEffect(() => {
        setIsLoadingEmployee(true);
        axiosInstance.get(`/employees/${id}`)
            .then((response) => {
                // Handle API structure properly
                if (response.data) {
                    // Adjust based on actual API response structure
                    setEmployeeData(response.data.data || response.data);
                } else {
                    setApiError("Failed to load employee data");
                }
            })
            .catch((error) => {
                setApiError("Failed to connect to the server. Please try again later.");
            })
            .finally(() => {
                setIsLoadingEmployee(false);
            });
    }, []);


    // Safe date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date) ? 'N/A' : date.toISOString().split("T")[0].split("-").reverse().join("-");
    };


    const Pagination = () => (
        <div className="flex items-center justify-center mt-4 gap-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
                Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? "bg-blue-900 text-white" : ""
                        }`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="animate-spin ml-16 rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }


    return (
        <div>
            {/* <Nav/> */}
            <div className=" pl-20 p-4 bg-gray-100 min-h-screen overflow-hidden">
            {/* Loading overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                </div>
            )}

            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-lg md:p-4 shadow-lg">
                    <div className="bg-gradient-to-r from-[#313860] to-[#151928] relative h-full text-white rounded-lg p-4 md:p-6 overflow-hidden min-h-[180px]">
                        <img
                            src={'https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/Group%201171275614.png?updatedAt=1741522515139'}
                            alt="Group"
                            className="w-48 md:w-80 lg:w-96 right-0 bottom-0 md:bottom-3 opacity-75 md:opacity-100 md:mr-4 absolute z-0"
                        />
                        <div className="relative z-10 max-w-[60%] md:max-w-none">
                            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">Hello, {employeeData.employeeName}!</h2>
                            <p className="text-xs md:text-sm opacity-90 leading-snug">
                                Great job! Your referrals are making a real difference—keep it going!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg p-3 md:p-4 shadow-lg">
                    <div className="flex flex-col md:flex-row h-full items-start gap-4">
                        <div className="w-full md:w-40 h-full lg:w-48 aspect-square bg-gray-100">
                            <img
                                src={'https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/7ec47348-583e-4a7a-9655-493c6c3b7b95-removebg-preview.png?updatedAt=1741522515589'}
                                alt="Profile"
                                className="w-full h-full rounded-md object-cover"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <div className="mb-2 md:mb-4">
                                <span className="bg-green-500 rounded-full px-3 py-1 text-xs md:text-sm text-white inline-block">
                                    Referral ID | {employeeData?.referralCode || "N/A"}
                                </span>
                                <h3 className="text-lg md:text-xl font-semibold mt-2">
                                    {employeeData?.employeeName || "Unknown Employee"}
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base mt-1">
                                    Making every connection count and driving success forward.
                                </p>
                            </div>
                            <ul className="space-y-2 md:space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <FaUserAlt className="flex-shrink-0 text-blue-900 w-4 h-4" />
                                    <span className="break-all">Staff ID: {employeeData?.employee_id || "N/A"}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <BsFillCalendarDateFill className="flex-shrink-0 text-blue-900 w-4 h-4" />
                                    <span>
                                        {employeeData?.createdAt
                                            ? new Date(employeeData.createdAt).toLocaleDateString('en-GB')
                                            : "Not Available"}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaEnvelope className="flex-shrink-0 text-blue-900 w-4 h-4" />
                                    <span className="break-all">{employeeData?.employeeEmail || "Not Available"}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaPhoneAlt className="flex-shrink-0 text-blue-900 w-4 h-4" />
                                    <span>{employeeData?.employeePhoneNumber || "Not Available"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Performance and Metrics */}
            <div className="md:bg-white rounded-lg md:p-4 md:shadow mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Performance Chart */}
                    <Chart />

                    {/* Key Metrics */}
                    <div className="md:bg-white rounded-lg md:p-6 md:shadow">
                        <h3 className="text-lg font-bold mb-4">Referral Key Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    label: "Total Referrals",
                                    value: totalReferrals,
                                    icon: <LuMessageCircleHeart />,
                                },
                                {
                                    label: "Active Referral",
                                    value: activeReferrals,
                                    icon: <BsClipboardCheck />,
                                },
                                {
                                    label: "Inactive Referral",
                                    value: inactiveReferrals,
                                    icon: <RiFileCloseLine />,
                                },
                                {
                                    label: "Total Fee Earned",
                                    value: totalReferralFeeEarned,
                                    icon: <LuMessageCircleHeart />,
                                },
                            ].map((metric, index) => (
                                <div key={index} className="p-4 border border-gray-200 shadow-sm rounded-xl bg-white space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-md text-blue-900 md:text-white text-xl ${index === 2 ? 'md:bg-red-400' : index === 1 ? 'md:bg-green-400' : 'md:bg-blue-500'}`}>
                                            {metric.icon}
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">{metric.label}</p>
                                    </div>

                                    <p className={`text-xl font-semibold ${index === 2 ? 'text-red-600' : index === 1 ? 'text-green-600' : 'text-blue-900'}`}>
                                        {metric.value}
                                    </p>

                                    <div className="w-full md:w-44 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        {metric.value ? (
                                            <div
                                                className={`h-full transition-all duration-300 ${index === 2 ? 'bg-red-500 shadow-[0_0_8px_#f87171]' : index === 1 ? 'bg-green-500 shadow-[0_0_8px_#34d399]' : 'bg-blue-900 shadow-[0_0_8px_#1e40af]'}`}
                                                style={{ width: '50%' }}
                                            ></div>
                                        ) : (
                                            <div className="h-full bg-transparent"></div> // Empty when no value
                                        )}
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* Referrals Section */}
                {apiError ? (
                    <div className="flex mt-7 flex-col items-center justify-center w-full h-64 bg-gray-50 border border-gray-200 rounded-lg shadow">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-3a1 1 0 012 0v4a1 1 0 01-2 0V7zm1 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-red-700 mt-3">No User Found</h2>
                        <p className="text-gray-600 text-sm mt-1 px-4 text-center">
                            We couldn't find any user records. Please check back later.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 bg-white rounded-lg p-4 shadow">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            {/* Toggle Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button
                                    className={`text-sm sm:text-base p-2 px-4 rounded-md transition-colors ${showOverall
                                            ? "bg-gradient-to-r from-[#151928] to-[#313860] text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => {
                                        setShowOverall(true);
                                        setCurrentPage(1);
                                    }}
                                >
                                    Overall Referrals
                                </button>
                                <button
                                    className={`text-sm sm:text-base p-2 px-4 rounded-md transition-colors ${!showOverall
                                            ? "bg-gradient-to-r from-[#151928] to-[#313860] text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => {
                                        setShowOverall(false);
                                        setCurrentPage(1);
                                    }}
                                >
                                    Current Month
                                </button>
                            </div>

                            {/* Search Input - now visible on mobile */}
                            <div className="w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search Customer Name"
                                    className="border outline-none px-4 py-2 w-full rounded-lg "
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="mt-4 w-full text-center">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 text-sm font-semibold text-gray-600">
                                            Customer
                                        </th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">
                                            Email
                                        </th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">
                                            Date of Joined
                                        </th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">
                                            Referral Amount
                                        </th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">
                                            Status
                                        </th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedReferrals.map((referral, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="font-medium">{referral.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {referral.user_id}
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">{referral.email}</td>

                                            <td className="p-3 text-sm">
                                                {formatDate(referral.createdAt)}
                                            </td>
                                            <td className="p-3 text-sm">209</td>{" "}
                                            <td className="p-3">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${referral.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-orange-100 text-orange-800"
                                                        }`}
                                                >
                                                    {referral.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            {/* Formatted Referral Date */}
                                            <td className="p-3">
                                                <button
                                                    className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                                                    onClick={() => setSelectedCustomer(referral)}
                                                >
                                                    View Details →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Improved Mobile Cards */}
                        <div className="md:hidden mt-4 space-y-3">
                            {paginatedReferrals.map((referral, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-gray-800">
                                                {referral.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                ID: {referral.user_id}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(referral.createdAt).toLocaleDateString("en-IN")}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-gray-500">Email:</div>
                                        <div className="text-gray-800 truncate">{referral.email}</div>

                                        <div className="text-gray-500">Amount:</div>
                                        <div className="text-gray-800">50</div>

                                        <div className="text-gray-500">Referral Date:</div>
                                        <div className="text-gray-800">
                                            {new Date("2025-01-22").toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>

                                        <div className="text-gray-500">Status:</div>
                                        <div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${referral.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-orange-100 text-orange-800"
                                                    }`}
                                            >
                                                {referral.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full mt-3 text-center text-blue-900 hover:text-blue-700 text-sm font-medium pt-3 border-t border-gray-200"
                                        onClick={() => setSelectedCustomer(referral)} // Fixed click handler
                                    >
                                        View Details →
                                    </button>
                                </div>
                            ))}
                        </div>

                        <Pagination />
                    </div>)}
            </div>

            {/* Customer Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 m-5 rounded-lg shadow-2xl w-96 lg:w-[40%] relative transform transition-all duration-300">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                            onClick={() => setSelectedCustomer(null)}
                        >
                            <MdClose className="w-6 h-6" />
                        </button>

                        <div className="flex items-center mb-6">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FaUser className="w-6 h-6 text-blue-900" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-blue-900">
                                    Customer Profile
                                </h3>
                                <p className="text-sm text-gray-500">
                                    User ID:
                                    <span className="font-mono ml-1 truncate break-all">
                                        #{selectedCustomer.user_id}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Personal Information Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                    <MdEmail className="w-5 h-5 mr-2" />
                                    Contact Information
                                </h4>
                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Full Name</p>
                                        <p className="font-medium truncate">
                                            {selectedCustomer.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Email Address</p>
                                        <p className="font-medium truncate">
                                            {selectedCustomer.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Phone Number</p>
                                        <p className="font-medium">
                                            {selectedCustomer.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Information Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                    <FaStore className="w-5 h-5 mr-2" />
                                    Business Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Business Name</p>
                                        <p className="font-medium truncate">
                                            {selectedCustomer.businessName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Business Type</p>
                                        <p className="font-medium capitalize">
                                            {selectedCustomer.businessType.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                           {/* Account Status Section */}
<div className="flex flex-row justify-between items-start md:items-center p-4 bg-white border border-blue-100 rounded-lg shadow-sm">
    {/* Status Badge */}
    <div className="mb-3 md:mb-0 flex items-center">
        <span
            className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${
                selectedCustomer.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {selectedCustomer.isActive ? (
                <FaCheckCircle className="mr-2 w-5 h-5 text-green-600" />
            ) : (
                <FaTimesCircle className="mr-2 w-5 h-5 text-red-600" />
            )}
            {selectedCustomer.isActive ? "Active" : "Inactive"}
            <span className="hidden sm:inline-block ml-2">Status</span>
        </span>
    </div>

    {/* Dates Section */}
    <div className="flex flex-col sm:flex-row gap-6 text-right">
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Member Since
            </p>
            <p className="text-sm font-semibold text-gray-900">
                {new Date(selectedCustomer.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </p>
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Subscription Ends
            </p>
            <p className="text-sm font-semibold text-gray-900">
                {new Date(selectedCustomer.subscriptionEndDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </p>
        </div>
    </div>
</div>
                            
                        </div>

                        <button
                            className="w-full mt-6 bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
                            onClick={() => setSelectedCustomer(null)}
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}

        </div>
        </div>
    );
};

export default Dashboard;