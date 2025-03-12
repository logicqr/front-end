import React, { useState, useRef, useEffect } from "react";
import { FaUserShield, FaUserTie, FaUserFriends, FaUserCheck } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
    FaUserCog,
    FaUsers,
    FaSort,
    FaSortUp,
    FaSortDown,
} from "react-icons/fa";
import { FiSearch, FiDownload,  } from "react-icons/fi";
import { HiOutlineUserAdd } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../auth/axios";

// Implemented Components
const Modal = ({ onClose, children }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);

const Dropdown = ({ trigger, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && <div className="absolute right-0 mt-2 z-10">{content}</div>}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Prev
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-50"
                        }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 r rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

const EmployeesDetails = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem("activeTab") || "staffs";
    });

    useEffect(() => {
        sessionStorage.setItem("activeTab", activeTab);
    }, [activeTab]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [staff, setStaff] = useState([]);
    const [admin, setAdmin] = useState([]);
    const [user, setUser] = useState("");
    const [activeUser, setActiveUser] = useState("")
    const [showPDFExport, setShowPDFExport] = useState(false);
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()

    const exportEmployeePDF = (emp) => {
        const doc = new jsPDF({
            orientation: "landscape", // Set to landscape for more width
            unit: "mm",
            format: "a4"
        });
    
        doc.setFont("helvetica");
    
        // Title
        doc.setFontSize(16);
        doc.text("Employee Data Export", 14, 15);
    
        // Table Headers
        const headers = [
            ["Staff ID", "Name", "Role", "Email", "Mobile", "Referral Code"]
        ];
    
        // Table Rows
        const data = employees.map(emp => [
            emp.id, 
            emp.name, 
            emp.role, 
            emp.email, 
            emp.mobile, 
            emp.referralId
        ]);
    
        // Generate table with increased width
        doc.autoTable({
            head: headers,
            body: data,
            startY: 25,
            theme: "striped",
            tableWidth: "auto", // Makes the table use full width
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 30 }, // Staff ID
                1: { cellWidth: 45 }, // Name
                2: { cellWidth: 40 }, // Role
                3: { cellWidth: 60 }, // Email
                4: { cellWidth: 40 }, // Mobile
                5: { cellWidth: 45 }  // Referral Code
            }
        });
    
        // Save the PDF
        doc.save("Employees_Export.pdf");
    
    };
    useEffect(() => {
        setLoading(true);
    
        const fetchStaffData = async () => {
            try {
                const response = await axiosInstance.get("/staff");
                const staffData = response.data;
                setStaff(staffData.data.map((emp) => ({
                    id: emp.employee_id,
                    name: emp.employeeName,
                    role: emp.role.charAt(0) + emp.role.slice(1).toLowerCase(),
                    referralId: emp.referralCode,
                    email: emp.employeeEmail,
                    mobile: emp.employeePhoneNumber,
                    responsibleEmployeeId: emp.responsibleEmployeeId || null,
                })));
            } catch (error) {
                console.error("Error fetching staff data:", error);
            }
        };
    
        const fetchAdminData = async () => {
            try {
                const response = await axiosInstance.get("/admin");
                const adminData = response.data;
                setAdmin(adminData.data.map((emp) => ({
                    id: emp.employee_id,
                    name: emp.employeeName,
                    role: emp.role.charAt(0) + emp.role.slice(1).toLowerCase(),
                    referralId: emp.referralCode,
                    email: emp.employeeEmail,
                    mobile: emp.employeePhoneNumber,
                    responsibleEmployeeId: emp.responsibleEmployeeId || null,
                })));
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };
    
        const fetchUserCounts = async () => {
            try {
                const response = await axiosInstance.get("/user-counts");
                const userCountData = response.data;
                setUser(userCountData.totalUsers);
                setActiveUser(userCountData.activeUsers);
            } catch (error) {
                console.error("Error fetching user count data:", error);
            }
        };
    
        const fetchData = async () => {
            await Promise.all([fetchStaffData(), fetchAdminData(), fetchUserCounts()]);
            setLoading(false);
        };
    
        fetchData();
    }, []);


    const employees = activeTab === "staffs" ? staff : admin;

    // Sorting functionality
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedEmployees = [...employees].sort((a, b) => {
        if (!sortConfig.key) return 0;
        if (sortConfig.direction === "asc") {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    // Search functionality
    const filteredEmployees = sortedEmployees.filter((emp) =>
        Object.values(emp).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination
    const recordsPerPage = 10;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredEmployees.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );
    const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

    // Action handlers
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowAddModal(true);
    };

    const handleDelete = (employeeId) => {
        if (activeTab === "staffs") {
            setStaff((prev) => prev.filter((emp) => emp.id !== employeeId));
        } else {
            setAdmin((prev) => prev.filter((emp) => emp.id !== employeeId));
        }
    };

    const getSortKey = (header) => {
        const headerToKey = {
            "Staff ID": "id",
            Name: "name",
            Role: "role",
            Email: "email",
            Mobile: "mobile",
            "Referral Code": "referralId",
        };
        return headerToKey[header];
    };

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen bg-white ml-14">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        );
      }

    return (
        <div className="bg-gray-50 pl-20 p-6">
 
            <div className=" container mx-auto min-h-screen">
                {/* Metrics Section */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[
                        {
                            icon: FaUserCog,
                            title: "Total Admin",
                            value: admin.length,
                            color: "blue",
                            bgColor: "bg-blue-100",
                            borderColor: "border-blue-500",
                            textColor: "text-blue-700",
                        },
                        {
                            icon: FaUserShield,
                            title: "Total Staff",
                            value: staff.length,
                            color: "orange",
                            bgColor: "bg-orange-100",
                            borderColor: "border-orange-500",
                            textColor: "text-orange-700",
                        },
                        {
                            icon: FaUserFriends,
                            title: "Total Users",
                            value: user,
                            color: "teal",
                            bgColor: "bg-teal-100",
                            borderColor: "border-teal-500",
                            textColor: "text-teal-700",
                        },
                        {
                            icon: FaUserCheck,
                            title: "Active Users",
                            value: activeUser,
                            color: "green",
                            bgColor: "bg-green-100",
                            borderColor: "border-green-500",
                            textColor: "text-green-700",
                        },
                    ].map((metric, i) => (
                        <div className="">
                            <div
                            key={i}
                            className={`group relative  p-3 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-out border-l-4 ${metric.borderColor} hover:-translate-y-1`}
                            aria-label={metric.title}
                        >
                            <div className="flex md:justify-between justify-center items-center">
                                
                                <div
                                    className={`md:hidden block w-24 flex-shrink-0 lg:p-3 p-2 rounded-lg ${metric.bgColor} ${metric.textColor} transition-colors duration-300`}
                                >
                                    <p className="text-sm text-gray-600 mb-1 font-medium line-clamp-1">{metric.title}</p>
                                    <div className="flex justify-between items-center">
                                        <metric.icon className="w-6 h-6" aria-hidden="true" />
                                        <p className="text-3xl font-bold text-gray-900">
                                            {metric.value.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="md:block hidden ">
                                    <p className="text-sm text-gray-600 mb-1 font-medium">{metric.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metric.value.toLocaleString()}
                                    </p>
                                </div>
                                <div
                                    className={` md:block hidden flex-shrink-0 p-3 rounded-lg ${metric.bgColor} ${metric.textColor} transition-colors duration-300`}
                                >
                                    <metric.icon className="w-6 h-6" aria-hidden="true" />
                                </div>
                            </div>

                            {/* Optional decorative background element */}
                            <div
                                className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${metric.bgColor} rounded-lg pointer-events-none`}
                                aria-hidden="true"
                            />
                        </div>
                        </div>
                    ))}
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2 border-b justify-between w-full md:w-fit">
                            {["staffs", "admin"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 -mb-px font-medium w-full ${activeTab === tab
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-fit">
                            <button
                                onClick={() => navigate("/employees-details/staff-registration")}
                                className="flex items-center justify-center md:justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-fit"
                            >
                                <div className="flex items-center gap-2"><HiOutlineUserAdd className="text-lg" /> Add Employee</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="bg-white rounded-lg shadow-sm p-5 mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Employee Management{" "}
                                <span className="text-blue-600">
                                    ({filteredEmployees.length})
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500">
                                Manage your organization's employees
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative lg:w-72">
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" onClick={exportEmployeePDF}>
                                <FiDownload /> Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Employee Table / Cards */}
                <div className="bg-white rounded-lg shadow-sm overflow-scroll">
                    {/* Table for larger screens */}
                    <table className="w-full hidden sm:table">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Staff ID",
                                    "Name",
                                    "Role",
                                    "Email",
                                    "Mobile",
                                    "Referral Code",
                                    // "Actions",
                                    "Explore",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort(getSortKey(header))}
                                    >
                                        <div className="flex items-center gap-2">
                                            {header}
                                            {header === "Explore" ? null : sortConfig.key ===
                                                getSortKey(header) ? (
                                                sortConfig.direction === "asc" ? (
                                                    <FaSortUp />
                                                ) : (
                                                    <FaSortDown />
                                                )
                                            ) : (
                                                <FaSort className="text-gray-300" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentRecords.map((emp, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {emp.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{emp.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {emp.mobile}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {emp.referralId}
                                    </td>
                                    {/* <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash />
                                            </button>
                                        </div>
                                    </td> */}
                                    <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/${activeTab === "staffs" ? `employees-details/${emp.id} ` : `employees-details/admin/${emp.id} `}`
                                                )
                                            }
                                        >
                                            Show More
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card layout for smaller screens */}
                    <div className="sm:hidden grid grid-cols-1 gap-4 p-4">
                        {currentRecords.map((emp, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2"
                            >
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {emp.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Role:</span> {emp.role}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">ID:</span> {emp.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Email:</span> {emp.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Mobile:</span> {emp.mobile}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Referral Code:</span>{" "}
                                    {emp.referralId}
                                </p>
                                {/* <Link
                                    to={`/${activeTab === "staffs"
                                        ? `/employee/${emp.id}`
                                        : `/admin/${emp.responsibleEmployeeId}`
                                        }`}
                                    onClick={() => console.log(emp.id)}
                                    className="text-blue-600"
                                >
                                    Show More
                                </Link> */}
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/${activeTab === "staffs" ? `employees-details/${emp.id} ` : `employees-details/admin/${emp.id} `}`
                                        )
                                    }
                                    className="text-blue-600"
                                >
                                    Show More
                                </button>

                                {/* <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => handleEdit(emp)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(emp.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FiTrash />
                                    </button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col items-center space-y-3">
                    <span className="text-sm text-gray-600">
                        Showing <strong>{indexOfFirstRecord + 1}</strong> -{" "}
                        <strong>{Math.min(indexOfLastRecord, filteredEmployees.length)}</strong> of{" "}
                        <strong>{filteredEmployees.length}</strong> results
                    </span>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="flex items-center space-x-2 rounded-md border px-4 py-2 shadow-md bg-white"
                    />
                </div>


                {/* Add/Edit Employee Modal
                {showAddModal && (
                    <Modal
                        onClose={() => {
                            setShowAddModal(false);
                            setSelectedEmployee(null);
                        }}
                    >
                        <h3 className="text-lg font-semibold mb-6">
                            {selectedEmployee ? "Edit Employee" : "Add New Employee"}
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    defaultValue={selectedEmployee?.name || ""}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border rounded-md"
                                    defaultValue={selectedEmployee?.email || ""}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option>Admin</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {selectedEmployee ? "Save Changes" : "Add Employee"}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )} */}
            </div>
        </div>
    );
};

export default EmployeesDetails;
