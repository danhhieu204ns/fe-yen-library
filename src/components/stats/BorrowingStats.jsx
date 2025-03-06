import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const BorrowingStats = () => {
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [borrowingByDay, setBorrowingByDay] = useState([]);
  const [returnStatus, setReturnStatus] = useState([]);
  const [averageBorrowTime, setAverageBorrowTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 500, height: 300 });
  
  const containerRef = useRef(null);

  // Define colors for charts
  const COLORS = ["#82ca9d", "#ffc658", "#ff8042"];

  useEffect(() => {
    // Set mock data
    const mockData = {
      monthlyTrends: [
        { month: '01/2023', borrowed: 45, returned: 38 },
        { month: '02/2023', borrowed: 52, returned: 48 },
        { month: '03/2023', borrowed: 49, returned: 43 },
        { month: '04/2023', borrowed: 63, returned: 55 },
        { month: '05/2023', borrowed: 58, returned: 52 }
      ],
      borrowingByDay: [
        { day: "Thứ 2", count: 42 },
        { day: "Thứ 3", count: 38 },
        { day: "Thứ 4", count: 45 },
        { day: "Thứ 5", count: 40 },
        { day: "Thứ 6", count: 52 },
        { day: "Thứ 7", count: 65 },
        { day: "Chủ nhật", count: 28 }
      ],
      returnStatus: [
        { status: "Đúng hạn", value: 280 },
        { status: "Trễ hạn", value: 45 },
        { status: "Chưa trả", value: 75 }
      ],
      averageBorrowTime: [
        { category: "Văn học", days: 12 },
        { category: "Khoa học", days: 18 },
        { category: "Kinh tế", days: 15 },
        { category: "Kỹ năng", days: 9 },
        { category: "Tiểu thuyết", days: 14 }
      ]
    };

    setMonthlyTrends(mockData.monthlyTrends);
    setBorrowingByDay(mockData.borrowingByDay);
    setReturnStatus(mockData.returnStatus);
    setAverageBorrowTime(mockData.averageBorrowTime);
    setLoading(false);
  }, []);

  // Update chart dimensions based on container size
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const cardWidth = document.querySelector('.chart-card')?.clientWidth || 500;
        setChartDimensions({
          width: cardWidth > 100 ? cardWidth - 40 : 500,
          height: 300
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8" ref={containerRef}>
      <h1 className="text-2xl font-bold mb-6 pt-16">Thống Kê Mượn Trả</h1>
 
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends Chart */}
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Xu hướng mượn và trả theo tháng</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div style={{ width: chartDimensions.width, height: chartDimensions.height }}>
                <LineChart
                  width={chartDimensions.width}
                  height={chartDimensions.height}
                  data={monthlyTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="borrowed" stroke="#8884d8" name="Sách mượn" />
                  <Line type="monotone" dataKey="returned" stroke="#82ca9d" name="Sách trả" />
                </LineChart>
              </div>
            </CardContent>
          </Card>
          
          {/* Borrowing By Day Chart */}
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Lượt mượn theo ngày trong tuần</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div style={{ width: chartDimensions.width, height: chartDimensions.height }}>
                <BarChart
                  width={chartDimensions.width}
                  height={chartDimensions.height}
                  data={borrowingByDay}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Số lượt mượn" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
          
          {/* Return Status Chart */}
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Tình trạng trả sách</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div style={{ width: chartDimensions.width, height: chartDimensions.height }}>
                <PieChart
                  width={chartDimensions.width}
                  height={chartDimensions.height}
                >
                  <Pie
                    data={returnStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="status"
                    label={({status, value}) => `${status}: ${value}`}
                  >
                    {returnStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </CardContent>
          </Card>
          
          {/* Average Borrowing Time Chart */}
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Thời gian mượn trung bình theo danh mục</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div style={{ width: chartDimensions.width, height: chartDimensions.height }}>
                <BarChart
                  width={chartDimensions.width}
                  height={chartDimensions.height}
                  data={averageBorrowTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ngày`, 'Thời gian mượn']} />
                  <Legend />
                  <Bar dataKey="days" fill="#82ca9d" name="Số ngày trung bình" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BorrowingStats;