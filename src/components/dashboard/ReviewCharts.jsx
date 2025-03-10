import React, { useState, useEffect } from "react";

import {
  BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Text
} from "recharts";
import axiosInstance from "../auth/axios";
const userId = sessionStorage.getItem("id");


const ReviewCharts = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}/dashboard`);
        const result = response.data;
  
        if (result) {
          const positivePercentage = parseFloat(result.positiveReviewPercentage) || 0;
          const negativePercentage = parseFloat(result.negativePercentage) || 0;
  
          setChartData([
            { category: "Positive", percentage: positivePercentage, color: "#ffffff" },
            { category: "Negative", percentage: negativePercentage, color: "#ffffff" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="w-full h-[400px] bg-gradient-to-r from-[#313860] to-[#151928] p-6 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        {isLoading ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
            <text x="50%" y="20" textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">
              Review Statistics
            </text>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" stroke="#fff" />
            <YAxis
              stroke="#fff"
              tickFormatter={(value) => value.toFixed(0)} // Format Y-axis values as integers
              domain={[0, 5]} // Set the range of the Y-axis
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.2)" }} contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#fff" }} />

            {chartData.some(entry => entry.percentage > 0) ? (
              <Bar 
                dataKey="percentage" 
                barSize={50} 
                fill="#ffffff"
                activeBar={<Rectangle fill="gold" stroke="purple" />} 
              >
                {chartData.map((entry, index) => (
                  <Rectangle key={index} fill={entry.color} stroke="#fff" />
                ))}
              </Bar>
            ) : (
              <text x="50%" y="50%" textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">
                No Data Available
              </text>
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewCharts;