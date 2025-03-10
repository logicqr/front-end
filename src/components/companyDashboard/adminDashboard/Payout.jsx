// src/components/PayoutDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../auth/axios";

const Payout = () => {
  const [employees, setEmployees] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [lastMonthAmount, setLastMonthAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setItemsPerPage(isMobile ? 6 : 10);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Pagination calculations
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/transactions/");
        const data = response.data;

        // Calculate totals
        const total = data.reduce((sum, t) => sum + t.amount, 0);
        const lastMonth = data
          .filter(
            (t) =>
              new Date(t.createdAt) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          )
          .reduce((sum, t) => sum + t.amount, 0);

        // Process employee data
        const employeeMap = data.reduce((acc, transaction) => {
          const empId = transaction.employee_id;
          if (!acc[empId]) {
            acc[empId] = {
              employee_id: empId,
              totalTransactions: 0,
              totalAmount: 0,
              uniqueUsers: new Set(),
              statusCounts: { paid: 0, pending: 0 },
            };
          }
          acc[empId].totalTransactions++;
          acc[empId].totalAmount += transaction.amount;
          acc[empId].uniqueUsers.add(transaction.user_id);
          acc[empId].statusCounts[transaction.status]++;
          return acc;
        }, {});

        setEmployees(Object.values(employeeMap));
        setTotalAmount(total);
        setLastMonthAmount(lastMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data preparation
  const monthlyData = employees.reduce((acc, emp) => {
    const month = new Date().toLocaleString("default", { month: "short" });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += emp.totalAmount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([name, amount]) => ({
    name,
    amount,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white ml-14">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:py-8 pl-20">
      <div className="container mx-auto">
        {/* <h1 className="md:text-4xl text-2xl hidden font-bold text-center md:text-left text-blue-900 mb-8 md:flex items-center gap-3">
          <FaRupeeSign className="text-blue-900" /> Payout Analytics Dashboard
        </h1> */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Amount</p>
                <p className="text-3xl font-bold text-blue-900">
                ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <FiTrendingUp className="text-4xl text-blue-600 bg-blue-100 p-2 rounded-full" />
            </div>
          </div>

          

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-blue-900">
                  {employees.reduce(
                    (sum, emp) => sum + emp.totalTransactions,
                    0
                  )} 
                </p>
              </div>
              <FiActivity className="text-4xl text-yellow-600 bg-yellow-100 p-2 rounded-full" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payouts</p>
                <p className="text-3xl font-bold text-blue-900">
                  ₹{employees.reduce(
                    (sum, emp) => sum + emp.totalTransactions,
                    0
                  )*209}
                </p>
              </div>
              <FaRupeeSign className="text-4xl text-purple-600 bg-purple-100 p-2 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last 30 Days</p>
                <p className="text-3xl font-bold text-blue-900">
                  ₹{lastMonthAmount.toLocaleString()}
                </p>
              </div>
              <FiTrendingUp className="text-4xl text-blue-600 bg-blue-100 p-2 rounded-full" />
            </div>
          </div>

         
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Monthly Payout Trends Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <FiTrendingUp className="text-purple-600" />
              Monthly Payout Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value / 1000}`}
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="url(#colorUv)"
                    radius={[8, 8, 4, 4]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employee Performance Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <FiActivity className="text-purple-600" />
              Employee Performance
            </h3>
            <div className="space-y-4">
              {employees
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .map((emp) => {
                  const percentage = (emp.totalAmount / totalAmount) * 100;
                  return (
                    <div
                      key={emp.employee_id}
                      className="group relative cursor-pointer"
                      title={`₹${emp.totalAmount.toLocaleString()} (${percentage.toFixed(
                        1
                      )}%)`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          #{emp.employee_id.slice(-6)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-400 h-3 rounded-full 
                          transition-all duration-500 ease-out group-hover:opacity-90"
                          style={{
                            width: `${percentage}%`,
                            boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)",
                          }}
                        >
                          <div className="absolute right-0 -mt-5 hidden group-hover:block bg-purple-600 text-white px-2 py-1 rounded-lg text-xs">
                            ₹{emp.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEmployees.map((employee) => (
            <Link
              to={`/payout/${employee.employee_id}`}
              key={employee.employee_id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 hover:text-purple-600 transition-colors">
                    Employee #{employee.employee_id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {employee.uniqueUsers.size} Users •{" "}
                    {employee.totalTransactions} Transactions
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    employee.statusCounts.pending > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  ₹{employee.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span>{employee.statusCounts.paid} Paid</span>
                </div>
              
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center  mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payout;
