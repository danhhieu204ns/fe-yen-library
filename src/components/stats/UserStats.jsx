import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { 
  userActivity, 
  ageDistribution, 
  genderDistribution
} from "@/data/userStatsMockData";

const UserStats = () => {
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [ageDistributionData, setAgeDistributionData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setActiveUsers(userActivity.slice(0, 5)); // Top 5 users
      setAgeDistributionData(ageDistribution);
      setGenderData(genderDistribution);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Simplified chart rendering, removing the ResponsiveContainer
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Thống Kê Độc Giả</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-md ${selectedTimeframe === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedTimeframe("weekly")}
          >
            Tuần này
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${selectedTimeframe === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedTimeframe("monthly")}
          >
            Tháng này
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${selectedTimeframe === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedTimeframe("yearly")}
          >
            Năm nay
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 độc giả mượn nhiều nhất</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div style={{ width: '100%', height: 300 }}>
                <BarChart 
                  width={500} 
                  height={300} 
                  data={activeUsers}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="borrowCount" name="Đã mượn" fill="#8884d8" />
                  <Bar dataKey="returnCount" name="Đã trả" fill="#82ca9d" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
          
          {/* Pie Chart - Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố độc giả theo độ tuổi</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div style={{ width: '100%', height: 300 }}>
                <PieChart 
                  width={500} 
                  height={300}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <Pie
                    data={ageDistributionData}
                    dataKey="value"
                    nameKey="age"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {ageDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a177ff'][index % 5]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </CardContent>
          </Card>
          
          {/* Pie Chart - Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo giới tính</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div style={{ width: '100%', height: 300 }}>
                <PieChart 
                  width={500} 
                  height={300}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    <Cell fill="#0088FE" /> {/* Nam */}
                    <Cell fill="#FF8042" /> {/* Nữ */}
                    <Cell fill="#FFBB28" /> {/* Khác */}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserStats;