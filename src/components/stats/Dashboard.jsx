import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Book, TrendingUp, Activity } from "lucide-react";
import { useStatsApi } from "src/services/statsService";
import useCategoryApi from "src/services/manageCategoryService";

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const { getLibraryStats, getMonthlyBorrowingStats } = useStatsApi();
    const { allCategoryNames } = useCategoryApi();

    useEffect(() => {
        const fetchStats = async () => {
            const res = await getLibraryStats();
            setStats(res?.data);
        };

        const fetchMonthlyData = async () => {
            const res = await getMonthlyBorrowingStats();
            setMonthlyData(res?.data);
        };

        const fetchCategoryData = async () => {
            const res = await allCategoryNames();
            setCategoryData(res?.categories);
            console.log(res);
        };

        fetchStats();
        fetchMonthlyData();
        fetchCategoryData();
    }, []);

    const COLORS = ["#1E90FF", "#32CD32", "#FF4500", "#FFD700", "#6A5ACD"];

    const cards = [
        { title: "Tổng sách", value: stats.total_books, icon: <Book />, color: "bg-blue-500" },
        { title: "Lượt mượn", value: stats.total_borrowings, icon: <TrendingUp />, color: "bg-green-500" },
        { title: "Đang mượn", value: stats.borrowed_books, icon: <Activity />, color: "bg-yellow-500" },
        { title: "Người dùng", value: stats.active_users, icon: <Users />, color: "bg-red-500" }
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">📊 Thống kê hệ thống</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }}>
                        <Card className={`shadow-lg ${card.color} text-white p-4 rounded-xl flex items-center gap-4`}>
                            {card.icon}
                            <div>
                                <CardTitle className="text-lg">{card.title}</CardTitle>
                                <CardContent className="text-3xl font-bold">{card.value}</CardContent>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 shadow-lg">
                    <CardHeader>
                        <CardTitle>📊 Số lượt mượn theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                
                <Card className="p-4 shadow-lg">
                    <CardHeader>
                        <CardTitle>📖 Tỷ lệ sách theo thể loại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={categoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                                    {categoryData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;