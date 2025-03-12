// src/components/PayoutDetails.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiInfo,
  FiHash,
  FiUser,
  FiCreditCard,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
  Line,
} from "recharts";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../auth/axios";

const PayoutDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) navigate("/admin-login");
    try {
      const decodedToken = jwtDecode(refreshToken);
      setRole(decodedToken.role === "ADMIN");
    } catch (error) {
      console.error("Invalid token", error);
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/transactions/${employeeId}`);
        setTransactions(
          response.data.map((t) => ({
            ...t,
            date: new Date(t.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            time: new Date(t.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  // Chart data calculations
  const statusData = [
    {
      name: "Paid",
      value: transactions.filter((t) => t.status === "paid").length,
    },
    {
      name: "Pending",
      value: transactions.filter((t) => t.status !== "paid").length,
    },
  ];

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.createdAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyData).map(
    ([name, amount]) => ({
      name,
      amount: Math.round(statusData[0].value * 209),
    })
  );

  // Sorting and filtering
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  const filteredTransactions = sortedTransactions.filter((t) => {
    const statusMatch = filterStatus === "all" || t.status === filterStatus;
    const searchMatch =
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paymentId.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pl-20">
        <div className="container mx-auto mt-8">
          <div className="animate-pulse bg-white rounded-xl shadow-lg p-4 mb-6">
            {/* Header */}
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 p-3 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gray-100 h-40 rounded-xl mb-8"></div>

            {/* Employee List */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 p-3 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:bg-gradient-to-br from-blue-50 to-purple-50 md:py-6 pt-6 pl-16">
      <div className="container mx-auto">
        <Link
          to="/payout"
          className={`items-center gap-2 pl-2 text-purple-600 hover:text-purple-800 mb-5 mt-1 ${role ? "flex" : "hidden"
            }`}
        >
          <FiArrowLeft className="inline-block" />{" "}
          <span className="">Back to Dashboard</span>
        </Link>

        <div className="bg-white md:rounded-2xl md:shadow-xl p-3 md:p-6 sm:p-8 md:mb-8">
          <div className="mb-8">
            <h2 className={`text-2xl sm:text-3xl font-bold text-blue-900 mb-4 ${role ? '' : 'hidden'}`}>
              Employee #{employeeId.slice(-6)} Transaction Overview
            </h2>




            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 `}>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Processed</p>
                    <p className="text-3xl font-bold mt-2">
                      ₹
                      {statusData[0].value * 209}
                    </p>
                  </div>
                  <FaRupeeSign className="w-12 h-12 opacity-25" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                  {transactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString() == 0
                    ? "0"
                    : +12}
                  % from last month
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Completed</p>
                    <p className="text-3xl font-bold mt-2">
                      {statusData[0].value}
                    </p>
                  </div>
                  <FiCheckCircle className="w-12 h-12 opacity-25" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
                  {(
                    (statusData[0].value / transactions.length) * 100 || 0
                  ).toFixed(1)}
                  % success rate
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 `}>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
                  <FiCreditCard className="text-purple-600 hidden md:block" /> Payment Status
                  Distribution
                </h3>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={["#10b981", "#f59e0b"][index]}
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ payload }) => (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-semibold">{payload[0]?.name}</p>
                            <p className="text-sm">
                              ₹{payload[0]?.value * 209} •{" "}
                              {(
                                (payload[0]?.value / transactions.length) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-2xl font-bold text-blue-900">
                      {transactions.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Txns</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hidden md:block">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
                  <FaRupeeSign className="text-purple-600" /> Monthly Payment
                  Flow
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyChartData}>
                      <defs>
                        <linearGradient
                          id="colorAmount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#1e3a8a" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${value}`}
                        tick={{ fill: "#1e3a8a" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                      />
                      <Tooltip
                        content={({ active, payload }) =>
                          active &&
                          payload && (
                            <div className="bg-white p-3 rounded-lg shadow-lg border">
                              <p className="font-semibold">
                                {payload[0]?.payload.name}
                              </p>
                              <p className="text-purple-600">
                                ₹{payload[0]?.value.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payload[0]?.payload.transactions} transactions
                              </p>
                            </div>
                          )
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                        dot={
                          <Dot
                            r={4}
                            fill="#7c3aed"
                            strokeWidth={2}
                            stroke="#fff"
                          />
                        }
                        activeDot={{
                          r: 6,
                          fill: "#fff",
                          stroke: "#7c3aed",
                          strokeWidth: 2,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Transaction List Section */}
            <div className="bg-white rounded-2xl ">
              <div className="flex md:gap-4 gap-1 mb-6">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400 hidden md:block" />
                  <input
                    type="text"
                    placeholder="Search name, ID, or payment ID..."
                    className="w-full md:pl-10 pl-2 text-sm md:text-base pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-all ${sortConfig.key === "createdAt"
                        ? "bg-purple-500 text-white "
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    Date{" "}
                    {sortConfig.key === "createdAt" && (
                      <FiChevronDown
                        className={`transform ${sortConfig.direction === "asc" ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.transaction_id}
                    className="group bg-white rounded-xl p-4 transition-all cursor-pointer hover:shadow-lg border border-gray-100 hover:border-purple-100"
                    onClick={() =>
                      setExpandedTransaction(
                        expandedTransaction === transaction.transaction_id
                          ? null
                          : transaction.transaction_id
                      )
                    }
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${transaction.status === "paid"
                              ? "bg-green-100"
                              : "bg-amber-100"
                            }`}
                        >
                          {transaction.status === "paid" ? (
                            <FiCheckCircle className="text-green-600 w-5 h-5" />
                          ) : (
                            <FiClock className="text-amber-600 w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">User</p>
                          <p className="font-medium text-blue-900">
                            {transaction.userName}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium text-purple-600">
                          ₹{transaction.type.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-blue-900">{transaction.date}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${transaction.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                              }`}
                          >
                            {transaction.status}
                          </span>

                        </div>



                        {expandedTransaction === transaction.transaction_id ? (
                          <FiChevronUp className="text-gray-400 group-hover:text-purple-600" />
                        ) : (
                          <FiChevronDown className="text-gray-400 group-hover:text-purple-600" />
                        )}
                      </div>
                    </div>

                    {expandedTransaction === transaction.transaction_id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Keep DetailItems same as before */}
                          <DetailItem
                            icon={<FiHash className="text-blue-900" />}
                            label="Transaction ID"
                            value={transaction.transaction_id}
                          />
                          <DetailItem
                            icon={<FiCreditCard className="text-blue-900" />}
                            label="Order ID"
                            value={transaction.orderId}
                          />
                          <DetailItem
                            icon={<FiCreditCard className="text-blue-900" />}
                            label="Payment ID"
                            value={transaction.paymentId}
                          />
                          <DetailItem
                            icon={<FiUser className="text-blue-900" />}
                            label="User ID"
                            value={transaction.user_id}
                          />
                          <DetailItem
                            icon={<FiUser className="text-blue-900" />}
                            label="Employee ID"
                            value={transaction.employee_id}
                          />
                          <DetailItem
                            icon={<FiClock className="text-blue-900" />}
                            label="Full Timestamp"
                            value={`${transaction.date} at ${transaction.time}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-blue-900 mt-1">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-mono text-sm break-all text-blue-900">{value}</p>
    </div>
  </div>
);

export default PayoutDetails;
