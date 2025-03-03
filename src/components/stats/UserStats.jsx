import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";

const UserStats = () => {
  const [userActivity, setUserActivity] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [registrationTrend, setRegistrationTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API calls would go here
        const mockUserActivity = [
          { name: "Nguyễn Văn A", borrowCount: 15 },
          { name: "Trần Thị B", borrowCount: 12 },
          { name: "Lê Văn C", borrowCount: 10 },
          { name: "Phạm Thị D", borrowCount: 9 },
          { name: "Hoàng Văn E", borrowCount: 8 }
        ];
        
        const mockAgeDistribution = [
          { age: "10-18", value: 120 },
          { age: "19-24", value: 250 },
          { age: "25-34", value: 180 },
          { age: "35-50", value: 90 },
          { age: "50+", value: 60 }
        ];
        
        const mockRegistrationTrend = [
          { month: "01/2023", count: 20 },
          { month: "02/2023", count: 25 },
          { month: "03/2023", count: 18 },
          { month: "04/2023", count: 32 },
          { month: "05/2023", count: 28 }
        ];
        
        setUserActivity(mockUserActivity);
        setAgeDistribution(mockAgeDistribution);
        setRegistrationTrend(mockRegistrationTrend);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thống Kê Độc Giả</h1>
      
      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 độc giả mượn nhiều nhất</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivity}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="borrowCount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Phân bố độc giả theo độ tuổi</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageDistribution}
                    dataKey="value"
                    nameKey="age"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {ageDistribution.map((entry, index) => (
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
              <CardTitle>Xu hướng đăng ký tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tỷ lệ độc giả theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { status: "Hoạt động", value: 350 },
                      { status: "Không hoạt động", value: 120 },
                      { status: "Mới", value: 80 },
                      { status: "Bị khóa", value: 15 }
                    ]}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#82ca9d" />
                    <Cell fill="#8884d8" />
                    <Cell fill="#ffc658" />
                    <Cell fill="#ff8042" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserStats;