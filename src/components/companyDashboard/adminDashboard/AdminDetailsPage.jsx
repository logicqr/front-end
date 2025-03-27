import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar, FiUsers } from "react-icons/fi";
import Nav from "../Nav";
import { MdError } from "react-icons/md";
import { GrValidate } from "react-icons/gr";
import axiosInstance from "../../auth/axios"

const AdminDetailsPage = () => {
    const { employeeId } = useParams();
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance(
                    `/admin/${employeeId}`
                );

                const data = response.data

                if (data.success) {
                    setEmployees(data.employees);
                    setUsers(data.users);
                } else {
                    setError("Failed to fetch employee data.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || "An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [employeeId]);

    const adminList = employees.filter(employee => employee.role === "ADMIN");
    const staffList = employees.filter(employee => employee.role === "STAFF");

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-red-500 text-lg p-4 bg-red-50 rounded-lg">{error}</div>
        </div>
    );

    return (
        <div>
      
            <div className="pl-16">
                <div className="  bg-gray-50 min-h-screen p-4 md:p-6">
                    <div className="">
                        <Link
                            to="/employees-details"
                            className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Dashboard
                        </Link>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                icon={<FiUsers className="w-6 h-6" />}
                                title="Total Admins"
                                value={adminList.length}
                                color="bg-purple-100"
                                textColor="text-purple-800"
                            />
                            <StatCard
                                icon={<FiUsers className="w-6 h-6" />}
                                title="Total Staff"
                                value={staffList.length}
                                color="bg-green-100"
                                textColor="text-green-800"
                            />
                            <StatCard
                                icon={<FiUsers className="w-6 h-6" />}
                                title="Total Users"
                                value={users.length}
                                color="bg-yellow-100"
                                textColor="text-yellow-800"
                            />
                            <StatCard
                                icon={<FiCalendar className="w-6 h-6" />}
                                title="Total Members"
                                value={employees.length + users.length}
                                color="bg-blue-100"
                                textColor="text-blue-800"
                            />
                        </div>

                        {/* Admin List */}
                        <Section title="Admins Team" count={adminList.length}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {adminList.map(admin => (
                                    <EmployeeCard key={admin.employee_id} employee={admin} />
                                ))}
                            </div>
                        </Section>

                        {/* Staff List */}
                        <Section title="Staff Team" count={staffList.length} className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {staffList.map(staff => (
                                    <EmployeeCard key={staff.employee_id} employee={staff} />
                                ))}
                            </div>
                        </Section>

                        {/* User List */}
                        <Section title="User List" count={users.length} className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {users.map(user => (
                                    <UserCard key={user.user_id} user={user} />
                                ))}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color, textColor }) => (
    <div className={`${color} p-6 rounded-xl shadow-sm`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className={`mt-2 text-3xl font-semibold ${textColor}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${textColor} bg-opacity-20`}>
                {icon}
            </div>
        </div>
    </div>
);

const Section = ({ title, count, children, className }) => (
    <div className={className}>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {count} members
            </span>
        </div>
        {children}
    </div>
);

const EmployeeCard = ({ employee }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">ID:</span> {employee.employee_id}
                </p>
                <h3 className="text-lg font-semibold text-gray-800">{employee.employeeName}</h3>
                <p className="mt-2 flex items-center text-sm text-gray-600">
                    <FiMail className="mr-2 opacity-70" />
                    {employee.employeeEmail}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-600">
                    <FiPhone className="mr-2 opacity-70" />
                    {employee.employeePhoneNumber}
                </p>
                <div className="mt-4 pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Referral Code:</span> {employee.referralCode}
                    </p>
                </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.role === "ADMIN"
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
                }`}>
                {employee.role}
            </span>
        </div>
    </div>
);

const UserCard = ({ user }) => {
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    // const subscriptionEnd = new Date(user.subscriptionEndDate).toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'short',
    //     day: 'numeric'
    // });

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">ID:</span> {user.user_id}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <p className="mt-2 flex items-center text-sm text-gray-600">
                        <FiMail className="mr-2 opacity-70" />
                        {user.email}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-600">
                        <FiPhone className="mr-2 opacity-70" />
                        {user.phoneNumber}
                    </p>
                    <p className={`mt-2 flex font-semibold items-center text-sm ${user.isActive ? "text-green-600" : "text-red-600"}`}>
    {user.isActive ? (
        <GrValidate className="mr-2 opacity-70 text-green-600" />
    ) : (
        <MdError className="mr-2 opacity-70 text-red-600" />
    )}
    {user.isActive ? "Active" : "Inactive"}
</p>
                    <div className="mt-4 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Business:</span> {user.businessName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Joined:</span> {joinDate}
                        </p>
                        {/* <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">subscriptionEnd:</span> {subscriptionEnd}
                        </p> */}
                    </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    USER
                </span>
            </div>
        </div>
    );
};

export default AdminDetailsPage;