import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const BorrowingStats = () => {
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [borrowingByDay, setBorrowingByDay] = useState([]);
  const [returnStatus, setReturnStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Giả định API
        const trendRes = await fetch('/api/stats/borrowing/monthly');
        const dayRes = await fetch('/api/stats/borrowing/by-day');
        const statusRes = await fetch('/api/stats/borrowing/status');
        
        setMonthlyTrends(await trendRes.json());
        setBorrowingByDay(await dayRes.json());
        setReturnStatus(await statusRes.json());
      } catch (error) {
        console.error("Failed to fetch borrowing stats:", error);
        
        // Mock data for demonstration
        setMonthlyTrends([
          { month: '01/2023', borrowed: 45, returned: 38 },
          { month: '02/2023', borrowed: 52, returned: 48 },
          { month: '03/2023', borrowed: 49, returned: 43 },
          { month: '04/2023', borrowed: 63, returned: 55 },
          { month: '05/2023', borrowed: 58, returned: 52 }
        ]);
        
        setBorrowingByDay([
          { day: "Thứ 2", count: 42 },
          { day: "Thứ 3", count: 38 },
          { day: "Thứ 4", count: 45 },
          { day: "Thứ 5", count: 40 },
          { day: "Thứ 6", count: 52 },
          { day: "Thứ 7", count: 65 },
          { day: "Chủ nhật", count: 28 }
        ]);
        
        setReturnStatus([
          { status: "Đúng hạn", value: 280 },
          { status: "Trễ hạn", value: 45 },
          { status: "Chưa trả", value: 75 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const COLORS = ["#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thống Kê Mượn Trả</h1>
      
      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng mượn và trả theo tháng</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="borrowed" stroke="#8884d8" name="Sách mượn" />
                  <Line type="monotone" dataKey="returned" stroke="#82ca9d" name="Sách trả" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Lượt mượn theo ngày trong tuần</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={borrowingByDay}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tình trạng trả sách</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={returnStatus}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {returnStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thời gian mượn trung bình theo danh mục</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { category: "Văn học", days: 12 },
                  { category: "Khoa học", days: 18 },
                  { category: "Kinh tế", days: 15 },
                  { category: "Kỹ năng", days: 9 },
                  { category: "Tiểu thuyết", days: 14 }
                ]}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="days" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BorrowingStats;