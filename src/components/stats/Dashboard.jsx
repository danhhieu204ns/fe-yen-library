import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Book, TrendingUp, Activity } from "lucide-react";
import { useStatsApi } from "src/services/statsService";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getLibraryStats, getMonthlyBorrowingStats, getBookByCategory } = useStatsApi();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, monthlyRes] = await Promise.all([
                    getLibraryStats(),
                    getMonthlyBorrowingStats(),
                ]);

                setStats(statsRes?.data || {});
                setMonthlyData(monthlyRes?.data?.monthly_borrows ? monthlyRes?.data?.monthly_borrows : []);
                
                try {
                    const categoryRes = await getBookByCategory();
                    const pieData = categoryRes.data.categories.map(cat => ({
                            name: cat.name,
                            value: parseInt(cat.count)
                        }));
                    
                    setCategoryData(pieData);
                } catch (categoryError) {
                    console.error("Error fetching category data:", categoryError);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const COLORS = ["#1E90FF", "#32CD32", "#FF4500", "#FFD700", "#6A5ACD", "#FF6347", "#4682B4"];

    const cards = [
        { title: "Tổng sách", value: stats.total_books || 0, icon: <Book className="h-6 w-6" />, bgColor: "#2563eb" }, // blue-600
        { title: "Lượt mượn", value: stats.total_borrowings || 0, icon: <TrendingUp className="h-6 w-6" />, bgColor: "#16a34a" }, // green-600
        { title: "Đang mượn", value: stats.borrowed_books || 0, icon: <Activity className="h-6 w-6" />, bgColor: "#eab308" }, // yellow-500
        { title: "Người dùng", value: stats.active_users || 0, icon: <Users className="h-6 w-6" />, bgColor: "#dc2626" }  // red-600
    ];

    // Define a very simple custom label renderer
    const renderCustomizedLabel = ({ name, percent }) => {
        return name && percent ? `${(percent * 100).toFixed(0)}%` : '';
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="pt-16 text-3xl font-bold text-gray-800">📊 Thống kê hệ thống</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }}>
                        <div 
                            className="shadow-lg rounded-xl p-4 text-white flex items-center gap-4"
                            style={{ backgroundColor: card.bgColor }}
                        >
                            <div className="bg-white/20 p-2 rounded-lg">
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white">{card.title}</h3>
                                <div className="text-3xl font-bold pt-2 text-white">
                                    {loading ? <Skeleton className="h-8 w-16 bg-white/50" /> : card.value}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 shadow-lg">
                    <CardHeader>
                        <CardTitle>📊 Số lượt mượn theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
                        {loading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : monthlyData && monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">Không có dữ liệu mượn sách</p>
                        )}
                    </CardContent>
                </Card>
                
                <Card className="p-4 shadow-lg">
                    <CardHeader>
                        <CardTitle>📖 Tỷ lệ sách theo thể loại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[300px] w-full flex items-center justify-center">
                                <p>Loading chart data...</p>
                            </div>
                        ) : (
                            <div>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={COLORS[index % COLORS.length]} 
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-medium mb-2">Dữ liệu thể loại:</h4>
                                    <div className="space-y-2">
                                        {categoryData.map((cat, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <div 
                                                    className="w-4 h-4 mr-2" 
                                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                ></div>
                                                <span>{cat.name}: {cat.value} sách</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;