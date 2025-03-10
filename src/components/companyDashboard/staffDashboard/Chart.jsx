import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../auth/axios";

const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const CustomBarChart = () => {
    const [chartData, setChartData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [referralsData, setReferralsData] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [chartHeight, setChartHeight] = useState(300);
    const [apiError, setApiError] = useState(null); // New state for API error
    const id = sessionStorage.getItem("id")

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setChartHeight(mobile ? 250 : 300);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const response = await axiosInstance.get(
                    `/staff/${id}/referrals`
                );

                if (response.data.success === false && response.data.message === "No users found for this referral code.") {
                    setApiError(response.data.message);
                    setChartData([]); // Clear existing chart data
                    setAvailableYears([]); // Clear existing years
                    setReferralsData([]); // Clear existing referrals
                    return; // Exit the function, preventing further processing
                }

                // Filter active referrals immediately after fetch
                const activeReferrals = response.data.data.filter(
                    (r) => r.isActive === true
                );
                setReferralsData(activeReferrals);

                // Calculate years based on active referrals only
                const years = [
                    ...new Set(
                        activeReferrals.map((r) => new Date(r.createdAt).getFullYear())
                    ),
                ].sort((a, b) => b - a);

                const currentYear = new Date().getFullYear();
                if (!years.includes(currentYear)) years.unshift(currentYear);

                setAvailableYears(years);
                processChartData(activeReferrals, selectedYear);
            } catch (error) {
                console.error("Error fetching referrals:", error);
                // setApiError("Failed to fetch data."); 
                setChartData([]);
                setAvailableYears([]);
                setReferralsData([]);
            }
        };
        fetchReferrals();
    }, []);

    useEffect(() => {
        if (referralsData.length > 0 && availableYears.length > 0) {
            processChartData(referralsData, selectedYear);
        }
    }, [selectedYear, referralsData, availableYears]);

    const processChartData = (referrals, year) => {
        const filteredReferrals = referrals.filter(
            (r) => new Date(r.createdAt).getFullYear() === year
        );

        const monthlyCounts = filteredReferrals.reduce((acc, referral) => {
            const date = new Date(referral.createdAt);
            const monthIndex = date.getMonth();
            acc[monthIndex] = (acc[monthIndex] || 0) + 1;
            return acc;
        }, {});

        const updatedData = monthAbbreviations.map((name, index) => ({
            name,
            value: monthlyCounts[index] || 0,
        }));

        setChartData(updatedData);
    };

    return (
        <div className="bg-gradient-to-r from-[#313860] to-[#151928] p-3 md:p-4 rounded-xl shadow-lg ">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-white text-lg md:text-xl font-semibold">
                    Referral Performance
                </h2>
                {availableYears.length > 0 && (
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="bg-[#333] text-white px-2 py-1 text-sm md:px-3 md:py-2 md:text-base outline-none rounded"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {apiError ? (
                <div className="text-white text-center py-4">
                    {apiError}
                </div>
            ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: isMobile ? 10 : 20,
                            left: 0,
                            bottom: isMobile ? 15 : 10,
                        }}
                    >
                        <XAxis
                            dataKey="name"
                            tick={{
                                fill: "#fff",
                                fontSize: isMobile ? 10 : 12,
                            }}
                        />
                        {!isMobile && (
                            <YAxis
                                tick={{
                                    fill: "#fff",
                                    fontSize: 12,
                                }}
                            />
                        )}
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.2)" }}
                            contentStyle={{
                                background: "#333",
                                border: "none",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: isMobile ? "5px 8px" : "10px 15px",
                            }}
                            itemStyle={{ fontSize: isMobile ? 12 : 14 }}
                            formatter={(value) => [value, "Referrals"]}
                        />
                        <Bar
                            dataKey="value"
                            fill="#fff"
                            radius={[10, 10, 0, 0]}
                            name="Referrals"
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-white text-center py-4 lg:mt-24">
                    No Active Users available.
                </div>
            )}
        </div>
    );
};

export default CustomBarChart;