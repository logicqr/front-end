import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import axiosInstance from '../auth/axios';

class CustomPieChart extends PureComponent {

  
  state = {
    activeIndex: 0,
    data: [],
    starRating: 0,
    ratingText: "",
    percentageOutOf100: null,
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.fetchData();
  }
 


  fetchData = async () => {
    try {
      const userId = sessionStorage.getItem("id");
      const response = await axiosInstance.get(`/users/${userId}/dashboard`);
  
      const result = response.data;
  
      if (!result.positiveReviewPercentage || result.totalLength === 0) {
        this.setState({ loading: false, data: this.getNoDataChart() });
        return;
      }
  
      const positive = parseFloat(result.positiveReviewPercentage);
      const negative = Math.max(5 - positive, 0);
      const percentageOutOf100 = ((positive / 5) * 100).toFixed(2);
  
      this.setState({
        data: [
          { name: "Positive Reviews", value: positive, fill: "#28a745" },
          { name: "Negative Reviews", value: negative, fill: "#dc3545" },
        ],
        starRating: positive,
        ratingText: this.getRatingText(positive),
        percentageOutOf100,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ loading: false, error: true, data: this.getNoDataChart() });
    }
  };
  

  getNoDataChart = () => [
    { name: 'No Data', value: 1, fill: '#d3d3d3' }, // Full gray pie chart
  ];

  getRatingText = (score) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Average";
    return "Low";
  };

  onPieEnter = (_, index) => {
    this.setState({ activeIndex: index });
  };

  renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
          {payload.name}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={10}>{`${value.toFixed(2)}%`}</text>
      </g>
    );
  };

  renderStars = () => {
    const { starRating } = this.state;
    const fullStars = Math.max(0, Math.floor(starRating) || 0);
    const hasHalfStar = starRating % 1 !== 0;

    return (
      <div className="flex justify-center gap-4 mt-3 text-yellow-500 text-3xl">
        {[...Array(fullStars)].map((_, index) => <FaStar key={index} />)}
        {hasHalfStar && <FaStarHalfAlt />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => <FaRegStar key={index + fullStars + 1} />)}
      </div>
    );
  };

  render() {
    const { loading, error, data, ratingText, percentageOutOf100 } = this.state;

    return (
      <div className="rounded-lg ">
        <h1 className="text-center text-xl font-semibold">Overall Rating</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {data[0]?.name === "No Data" ? (
              <h2 className="text-lg font-bold text-center text-gray-500">No Data Available</h2>
            ) : (
              <>
                {this.renderStars()}
                <ResponsiveContainer width="100%" height={235}>
                  <PieChart>
                    <Pie
                      activeIndex={this.state.activeIndex}
                      activeShape={this.renderActiveShape}
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      dataKey="value"
                      onMouseEnter={this.onPieEnter}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <h2 className="text-lg font-bold  text-center text-green-600">{ratingText}</h2>
                <h3 className="text-2xl text-center font-bold">{percentageOutOf100}%</h3>
                <p className="text-gray-600 text-sm text-center">
                  Of your customers are satisfied with your service.<br className='block lg:hidden'/> Great Job!
                </p>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

export default CustomPieChart;