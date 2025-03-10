import React, { useState,useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";
import { LuLayoutDashboard, LuTag } from "react-icons/lu";
import { TbReceiptRupee } from "react-icons/tb";
import { FaClipboardList } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import axios from "axios";
import { BiSupport } from "react-icons/bi";
import axiosInstance from "../auth/axios";
import { GrStorage } from "react-icons/gr";



function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Hook to get the current path
    // const role = sessionStorage.getItem("role")
    const id = sessionStorage.getItem("id")
    const [role, setRole] = useState(null);
    const [employeeData,setEmployeeData] = useState('')
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    // const [id, setId] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/employees/${id}`);
                setEmployeeData(response.data.data.employeeName );
                // console.log(response.data.data.employeeName);
            } catch (err) {
                console.error("Error fetching employee data:", err);
            }
        };

        fetchData();
    }, []);

    

    useEffect(() => {
        const refreshToken = sessionStorage.getItem("refreshToken"); // Retrieve token
// console.log(refreshToken)
        if (refreshToken) {
            try {
                const decodedToken = jwtDecode(refreshToken); // Decode token
                // console.log(decodedToken)
                setRole(decodedToken.role);
                // setId(decodedToken.id);
            } catch (error) {
                console.error("Invalid token", error);
                navigate("/admin-login")
            }
        }else{
            navigate("/admin-login")
        }
    }, []);


    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/admin-login'; // Redirect to the login page
    };
    

    const menuItems = {
        ADMIN: [
            { name: "Dashboard", path: `/admin/dashboard/${id}`, icon: <LuLayoutDashboard className="text-2xl" /> },
            { name: "Account Setting", path: "/account-setting", icon: <CgProfile className="text-2xl" /> },
            { name: "Payout", path: "/payout", icon: <TbReceiptRupee className="text-2xl" /> },
            { name: "Employees Details", path: "/employees-details", icon: <FaClipboardList className="text-2xl" /> },
            { name: "Help Dashboard", path: "/help-dashboard", icon: <BiSupport className="text-2xl" /> },
            { name: "Temp Orders", path: "/temp-orders", icon: <GrStorage className="text-2xl" /> },

        ],
        STAFF: [
            { name: "Dashboard", path: `/staff/dashboard/${id}`, icon: <LuLayoutDashboard className="text-2xl" /> },
            { name: "Account Settings", path: "/account-setting", icon: <CgProfile className="text-2xl" /> },
            { name: "Payout", path: `payout/${id}`, icon: <TbReceiptRupee className="text-2xl" /> },
            { name: "Temp Orders", path: "/temp-orders", icon: <GrStorage className="text-2xl" /> },
        ],
    };

    const itemsToDisplay = menuItems[role] || [];

    return (
        <div className="fixed z-40">
            <div
                className={`absolute transition-all duration-300 ${isOpen ? "w-64" : "w-16"
                    } bg-blue-950 h-screen flex flex-col  text-white`}
            >
                {/* Header */}
                <div className="p-5 flex justify-between items-center border-b-2">
                    <h1 className={`text-lg font-bold ${isOpen ? "" : "hidden"}`}>Logic QR</h1>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-lg"
                    >
                        {isOpen ? <IoMdClose className="text-3xl" /> : <CgMenuGridR className="text-3xl" />}
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col mt-4 space-y-4 p-1">
                    {itemsToDisplay.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-4 py-2 transition ${location.pathname.includes(item.path)
                                ? "bg-white text-black"
                                : "hover:bg-white hover:text-black"
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className={`ml-3 ${isOpen ? "" : "hidden"}`}>{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <div className=" mt-auto space-y-3 text-lg p-1 border-t lg:pb-5 pb-24 border-white ">
                    <div className="flex items-center px-4 pt-4  p-1">
                        <div className="flex items-center bg-white  w-6 h-6 rounded-full justify-center">
                            <CgProfile className="text-2xl text-[#032068]" />
                        </div>
                        {isOpen && <h1 className="ml-3">{employeeData}</h1>}
                    </div>
                    
                    <button onClick={()=>setShowLogoutPopup(true)} className="flex items-center px-4 p-1  w-full hover:bg-red-600 transition">
                        <MdOutlineLogout className="text-2xl" />
                        {isOpen && <span className="ml-3">Logout</span>}
                    </button>

                </div>
            </div>
            {/* Logout Confirmation Modal */}
        {showLogoutPopup && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="px-5 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200 border border-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-[#032068] text-white hover:bg-[#031a5a] transition-colors duration-200"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
    );
}

export default Nav;
