import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useStatsApi } from "src/services/statsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for multiple years
const MOCK_DATA = {
  "2023": [
    { month: "Tháng 1", count: 65 },
    { month: "Tháng 2", count: 59 },
    { month: "Tháng 3", count: 80 },
    { month: "Tháng 4", count: 81 },
    { month: "Tháng 5", count: 56 },
    { month: "Tháng 6", count: 55 },
    { month: "Tháng 7", count: 40 },
    { month: "Tháng 8", count: 70 },
    { month: "Tháng 9", count: 90 },
    { month: "Tháng 10", count: 75 },
    { month: "Tháng 11", count: 62 },
    { month: "Tháng 12", count: 88 }
  ],
  "2022": [
    { month: "Tháng 1", count: 45 },
    { month: "Tháng 2", count: 52 },
    { month: "Tháng 3", count: 70 },
    { month: "Tháng 4", count: 65 },
    { month: "Tháng 5", count: 60 },
    { month: "Tháng 6", count: 45 },
    { month: "Tháng 7", count: 50 },
    { month: "Tháng 8", count: 55 },
    { month: "Tháng 9", count: 75 },
    { month: "Tháng 10", count: 80 },
    { month: "Tháng 11", count: 72 },
    { month: "Tháng 12", count: 68 }
  ],
  "2021": [
    { month: "Tháng 1", count: 35 },
    { month: "Tháng 2", count: 42 },
    { month: "Tháng 3", count: 45 },
    { month: "Tháng 4", count: 50 },
    { month: "Tháng 5", count: 55 },
    { month: "Tháng 6", count: 40 },
    { month: "Tháng 7", count: 45 },
    { month: "Tháng 8", count: 50 },
    { month: "Tháng 9", count: 65 },
    { month: "Tháng 10", count: 70 },
    { month: "Tháng 11", count: 60 },
    { month: "Tháng 12", count: 55 }
  ]
};

const MonthlyStats = () => {
    // Initialize with current year and data for that year
    const currentYear = new Date().getFullYear().toString();
    const availableYears = Object.keys(MOCK_DATA).sort((a, b) => b.localeCompare(a)); // Sort descending
    
    const [selectedYear, setSelectedYear] = useState(availableYears[0] || currentYear);
    const [data, setData] = useState(MOCK_DATA[selectedYear] || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { getMonthlyBorrowingStats } = useStatsApi();

    useEffect(() => {
        // For development, use mock data directly
        if (process.env.NODE_ENV !== 'production') {
            setData(MOCK_DATA[selectedYear] || []);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getMonthlyBorrowingStats(selectedYear);
                if (res && res.data && res.data.length > 0) {
                    setData(res.data);
                } else {
                    // Fall back to mock data if API returns empty data
                    setData(MOCK_DATA[selectedYear] || []);
                }
            } catch (error) {
                console.error(`Failed to fetch monthly stats for ${selectedYear}:`, error);
                setError(error);
                // Fall back to mock data
                setData(MOCK_DATA[selectedYear] || []);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [selectedYear, getMonthlyBorrowingStats]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    return (
        <Card className="w-full pt-20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">Thống Kê Mượn Sách Theo Tháng</CardTitle>
                <div className="flex items-center space-x-2">
                    <label htmlFor="year-select" className="mr-2 text-sm font-medium">Năm:</label>
                    <select 
                        id="year-select" 
                        value={selectedYear} 
                        onChange={handleYearChange}
                        className="rounded-md border border-gray-300 bg-white py-1 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {loading ? (
                    <div className="flex justify-center items-center h-[350px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart 
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12 }} 
                                tickMargin={8}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: "rgba(255, 255, 255, 0.9)", 
                                    borderRadius: "4px", 
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                    border: "none"
                                }} 
                                formatter={(value) => [`${value} lượt mượn`]} 
                                labelFormatter={(label) => `${label}, ${selectedYear}`}
                            />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Bar 
                                dataKey="count" 
                                fill="#8884d8" 
                                name="Số lượt mượn" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1000}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
                
                {error && (
                    <div className="text-sm text-muted-foreground text-center mt-2">
                        Đang hiển thị dữ liệu mẫu do lỗi kết nối API
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MonthlyStats;
