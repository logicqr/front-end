import React, { useState } from 'react'
import Nav from '../Nav'
import { FiArrowLeft } from "react-icons/fi";
import { Link } from 'react-router-dom';
import axiosInstance from '../../auth/axios';

function StaffRegister() {

    const [formData, setFormData] = useState({
        role: "",
        employeeName: "",
        employeeEmail: "",
        employeePhoneNumber: "",
        employeeAddress: "",
        referralCode: "",
        aadhaarNumber: "",
        employeePassword: "",
        confirmPassword: "",
    });

    const [isOpen2, setIsOpen2] = useState(false);
    const [name, setName] = useState('')
    const [staffId, setStaffId] = useState('')
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [doj, setDoj] = useState('')
    const [refferralId, setRefferralId] = useState('')

    const [showErrorModal, setShowErrorModal] = useState(false);

    const [message, setMessage] = useState("All fields are required");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employeeName || !formData.employeeEmail || !formData.employeePhoneNumber ||
            !formData.employeeAddress || !formData.referralCode || !formData.aadhaarNumber ||
            !formData.employeePassword || !formData.confirmPassword) {
            setMessage("All fields are required");
            setShowErrorModal(true)
            return
        }

        if (formData.employeePassword !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            setShowErrorModal(true)
            return;
        }

        try {
            const formattedData = {
                ...formData,
                employeeEmail: formData.employeeEmail.toLowerCase(), // Convert email to lowercase
            };
            const response = await axiosInstance.post("/employees/register", formattedData);
            if (response.status === 200) {
                setMessage("Registration Successful");
                // console.log("Registration Successful:", response.data);
                // console.log(response.data.data.employeeName)
                // console.log(response.data.data.referralCode)
                // console.log(response.data.data.role)
                // console.log(response.data.data.createdAt)
                // console.log(response.data.data.employeeEmail)
                const date = new Date(response.data.data.createdAt);
                const formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                setRole(response.data.data.role)
                setRefferralId(response.data.data.referralCode)
                setName(response.data.data.employeeName)
                const id = response.data.data.employee_id.toUpperCase();
                setStaffId(id)
                setEmail(response.data.data.employeeEmail)
                setDoj(formattedDate)
                setIsOpen2(true)
            } else {
                setMessage("Contact Administration")
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration Failed");
            console.error("Registration Failed:", error.response?.data || error.message);
        }
    };
    const handleViewProfile = () => {
        setFormData({
            role: "",
            employeeName: "",
            employeeRoll:"",
            employeeEmail: "",
            employeePhoneNumber: "",
            employeeAddress: "",
            referralCode: "",
            aadhaarNumber: "",
            employeePassword: "",
            confirmPassword: "",
        });
    
        setMessage(""); // Reset message if needed
        setIsOpen2(false); // Close the popup
    };

    return (
        <div className="">
         
            <div className="pl-16 flex flex-col justify-center min-h-screen">
                <div className="w-full max-w-7xl mx-auto lg:shadow-md rounded-lg lg:p-5 p-3 bg-white">
                    {/* Header */}
                    <Link
                            to="/employees-details"
                            className="inline-flex items-center mb-6 text-blue-800 hover:text-blue-900 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Dashboard
                        </Link>
                    <div className="bg-blue-100 border-l-4 border-blue-600 text-blue-700 p-2 lg:p-4 text-xl font-semibold rounded-md">
                        <h1>Register New Employee</h1>
                    </div>
                    

                    {/* Employee Information */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    name='role'
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                >
                                    <option value="" disabled >
                                        Select Role
                                    </option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="STAFF">STAFF</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input
                                    name='employeeName'
                                    value={formData.employeeName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Full Name"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <input
                                    name='employeeEmail'
                                    value={formData.employeeEmail}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Enter Employee Email-ID"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Residential Address</label>
                                <input
                                    name='employeeAddress'
                                    value={formData.employeeAddress}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Employee Address"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Contact Number</label>
                                <input
                                    name='employeePhoneNumber'
                                    value={formData.employeePhoneNumber}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Employee Phone Number"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Authentication Details */}
                    <div className="mt-10">
                        <h2 className="text-lg font-semibold mb-4">Authentication Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2">Referral Code</label>
                                <input
                                    name='referralCode'
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Admin Referral Code"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Aadhaar Number</label>
                                <input
                                    name='aadhaarNumber'
                                    value={formData.aadhaarNumber}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Aadhaar Number"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    name='employeePassword'
                                    value={formData.employeePassword}
                                    onChange={handleChange}
                                    type="password"
                                    placeholder="Enter Password"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <input
                                    name='confirmPassword'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    type="password"
                                    placeholder="Re-enter Password"
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-1 focus:outline-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                         onClick={() => setFormData({
                            role: "",
                            employeeName: "",
                            employeeEmail: "",
                            employeePhoneNumber: "",
                            employeeAddress: "",
                            referralCode: "",
                            aadhaarNumber: "",
                            employeePassword: "",
                            confirmPassword: "",
                          })}  className="px-6 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition">
                            Reset
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
                            Register Employee
                        </button>
                    </div>
                </div>
                {showErrorModal && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-3 lg:p-6 rounded-md shadow-md text-center">
              <lord-icon
                src="https://cdn.lordicon.com/azxkyjta.json"
                trigger="in"
                delay="500"
                state="in-reveal"
                style={{ width: "60px", height: "60px" }}>
              </lord-icon>
              <h2 className="text-red-600 font-semibold text-lg">{message}</h2>
              <p className="text-gray-600">There was an error submitting your request.</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
                {isOpen2 && (
                    <div className="fixed z-50 inset-0 flex justify-center items-center bg-black bg-opacity-50 px-4">
                        <div className="bg-white rounded-2xl shadow-lg p-6 w-full  max-w-md">
                            {/* Success Message */}
                            <h2 className="text-lg font-semibold text-center">Employee
                            </h2>
                            <h2 className="text-lg font-semibold text-center" > Added Successfully!</h2>
                            <p className="text-gray-600 text-center md:text-sm text-xs mt-5">
                                <strong className="text-black text">Staff ID #{staffId}</strong> added to the team.
                                They can now start referring and tracking their performance.
                            </p>

                            {/* Card Section */}
                            <div className="bg-[#0F2C60] text-white rounded-lg lg:p-6 px-3 py-6 space-y-4 mt-6 ">
                                <div className="flex justify-center ">
                                    {/* <lord-icon
                  src="https://cdn.lordicon.com/mhnfcfpf.json"
                  trigger="in"
                  delay=""
                  state="in-autorenew"
                  colors="primary:#ffffff"
                  style={{ width: "70px", height: "70px" }}>
                </lord-icon> */}
                                    <div className='rounded-full flex items-center border-2  p-2 border-[#30e849] justify-center '>


                                        <lord-icon
                                            src="https://cdn.lordicon.com/hrtsficn.json"
                                            trigger="in"
                                            delay=""
                                            state="in-reveal"
                                            colors="primary:#30e849"
                                            style={{ width: "30px", height: "30px" }}>
                                        </lord-icon>
                                    </div>
                                </div>
                                <p className="bg-green-500 text-white md:text-sm text-xs font-medium w-56 mx-auto py-1 rounded-full text-center mt-1">
                                    Referral ID {refferralId}
                                </p>

                                <h3 className="md:text-lg text-base font-semibold text-center mt-2 ">Employee Detail</h3>
                                <div className="border-t border-dashed border-gray-300 my-3 opacity-40"></div>

                                <div className="space-y-2 md:text-sm text-xs">
                                    <p className="flex justify-between"><span className="text-gray-300">Employee Name</span> <span>{name}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-300">Role</span> <span>{role}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-300">Email</span> <span>{email}</span></p>

                                    <p className="flex justify-between"><span className="text-gray-300">Date Of Joining</span> <span>{doj}</span></p>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button className="flex-1 border rounded-md py-2 text-xs md:text-sm bg-white text-black font-medium" onClick={handleViewProfile}>Close</button>
                                    {/* <button className="flex-1 border rounded-md py-2 text-xs md:text-sm bg-white text-black font-medium">Share Profile Details</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>

    )
}

export default StaffRegister



