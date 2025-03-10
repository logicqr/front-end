import React, { useEffect, useState } from "react";
import axiosInstance from "../../auth/axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaChevronRight,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { motion } from "framer-motion";
import Charts from "./Charts";

const Card = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const Avatar = ({ src, alt, className }) => (
  <div className={`relative ${className}`}>
    <img
      src={src}
      alt={alt}
      className="rounded-full w-full h-full object-cover border-2 border-white shadow-sm"
    />
  </div>
);

const MetricCard = ({ title, value, icon, color, loading }) => (
  <Card className="p-4 h-full">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {loading ? (
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            title
          )}
        </p>
      </div>
      <div
        className={`p-3 rounded-lg ${
          loading ? "bg-gray-200" : `bg-${color}-100`
        } ${!loading && `text-${color}-600`} animate-pulse`}
      >
        {loading ? <div className="w-6 h-6" /> : icon}
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState({});
  const AdminId = sessionStorage.getItem("id");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminData, teamData] = await Promise.all([
        axiosInstance.get(`/employees/${AdminId}`),
        axiosInstance.get(`/admin/${AdminId}`),
      ]);

      setAdminProfile(adminData.data.data);
      setEmployees(teamData.data.employees);
      setUsers(teamData.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStaff = employees.length;
  const activeReferrals = users.filter((user) => user.isActive).length;
  const successRate =
    users.length > 0
      ? ((activeReferrals / users.length) * 100).toFixed(0)
      : 0;

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:py-6 pl-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {loading ? (
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          ) : (
            `Welcome, ${adminProfile.employeeName}`
          )}
        </h1>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-80 mt-2 animate-pulse" />
          ) : (
            employees.length > 0
              ? `${totalStaff} team members • ${users.length} total referrals`
              : "Get started by adding your first team member"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Team Members"
              value={totalStaff}
              icon={<IoIosPeople className="text-2xl" />}
              color="blue"
              loading={loading}
            />
            <MetricCard
              title="Total Referrals"
              value={users.length}
              icon={<IoTicketSharp className="text-2xl" />}
              color="purple"
              loading={loading}
            />
            <MetricCard
              title="Success Rate"
              value={`${successRate}%`}
              icon={<FaChartLine className="text-2xl" />}
              color="green"
              loading={loading}
            />
          </div>

          {/* Charts */}
          <Card className=" md:p-6 ">
            <Charts
              hasData={employees.length > 0 || users.length > 0}
              loading={loading}
            />
          </Card>

          {/* Team Members */}
          <Card className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Team Members
              </h3>
              {!loading && (
                <button className="text-blue-600 text-sm flex items-center gap-1 hover:gap-2 transition-all font-medium">
                  {employees.length ? "View All" : "Add Member"}
                  <FaChevronRight className="text-xs mt-0.5" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {loading ? (
                Array(3)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 animate-pulse"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                  ))
              ) : employees.length > 0 ? (
                employees.map((employee) => (
                  <motion.div
                    key={employee.employee_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={`https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/raise-your-business-marketing-strategy-concept-flat-social-media-post-banner-template_835895-23685_avif.heif?updatedAt=1741522515599`}
                        className="w-8 h-8"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {employee.employeeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[160px]">
                      {employee.employeeEmail}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No team members found
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Admin Profile */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col items-center">
              {loading ? (
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                <Avatar
                  src={`https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/7ec47348-583e-4a7a-9655-493c6c3b7b95-removebg-preview.png?updatedAt=1741522515589`}
                  className="w-20 h-20"
                />
              )}
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-gray-800">
                  {loading ? (
                    <div className="h-6 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
                  ) : (
                    adminProfile.employeeName
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {loading ? (
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto mt-2 animate-pulse" />
                  ) : (
                    "Administrator"
                  )}
                </p>
              </div>

              <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-3 p-2 text-gray-600">
                  <IoTicketSharp className="flex-shrink-0 text-xl" />
                  <p className="text-sm truncate">
                    {loading ? (
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    ) : (
                      adminProfile.referralCode || "No Code"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-2 text-gray-600">
                  <FaEnvelope className="flex-shrink-0" />
                  <p className="text-sm truncate">
                    {loading ? (
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    ) : (
                      adminProfile.employeeEmail || "No email"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-2 text-gray-600">
                  <FaPhoneAlt className="flex-shrink-0" />
                  <p className="text-sm">
                    {loading ? (
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    ) : (
                      adminProfile.employeePhoneNumber || "No phone"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Recent Referrals
            </h3>
            <div className="space-y-3">
              {loading ? (
                Array(3)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 animate-pulse"
                    >
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    </div>
                  ))
              ) : users.length > 0 ? (
                users.slice(0, 5).map((user) => (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {user.name || "Unnamed Referral"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent referrals
                </div>
              )}
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;