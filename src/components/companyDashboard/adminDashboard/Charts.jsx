import React, { useState, useEffect } from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Dot
} from "recharts";
import { FaRegChartBar } from "react-icons/fa";
import axiosInstance from "../../auth/axios";

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const monthName = new Date(0, label).toLocaleString("default", { month: "long" });
    return (
      <div className="bg-white p-3 shadow-md rounded-lg border border-gray-100">
        <p className="font-semibold text-blue-600">{monthName}</p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Users:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function Charts() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const AdminId = sessionStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/admin/${AdminId}`);
        const users = response.data.users || [];
        const active = users.filter(user => user.isActive);
        
        setActiveUsers(active);

        const years = active.map(user => 
          new Date(user.createdAt).getFullYear()
        );
        const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
        
        if (uniqueYears.length === 0) {
          uniqueYears.push(new Date().getFullYear());
        }

        setAvailableYears(uniqueYears);
        setSelectedYear(uniqueYears[0]);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear === null) return;

    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: index,
      value: 0,
    }));

    activeUsers.forEach(user => {
      const date = new Date(user.createdAt);
      const year = date.getFullYear();
      if (year === selectedYear) {
        const month = date.getMonth();
        monthlyData[month].value += 1;
      }
    });

    setData(monthlyData);
  }, [selectedYear, activeUsers]);

  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaRegChartBar className="text-blue-500 animate-pulse" />
          User Growth Analytics
        </h3>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent font-medium text-blue-600 focus:outline-none"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : data.some(item => item.value > 0) ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tickFormatter={(month) =>
                new Date(0, month).toLocaleString("default", { month: "short" })
              }
              axisLine={false}
              tick={{ fill: "#6B7280" }}
              tickLine={false}
            />
            <YAxis 
              axisLine={false} 
              tick={{ fill: "#6B7280" }}
              tickLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#colorUv)"
              dot={<Dot r={5} fill="#3B82F6" strokeWidth={2} stroke="#fff" />}
              activeDot={{ r: 8, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center space-y-4">
          <div className="text-6xl">📊</div>
          <p className="text-gray-500 text-lg">
            {activeUsers.length === 0 
              ? "No active users found" 
              : "No data available for selected year"}
          </p>
        </div>
      )}
    </Card>
  );
}

export default Charts;