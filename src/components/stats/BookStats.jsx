import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useStatsApi from "src/services/statsService";

const BookStats = () => {
  const [booksByCategory, setBooksByCategory] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [bookStatus, setBookStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartKey, setChartKey] = useState(0);
  
  const { getBookByCategory, getTopBorrowedBooks, getBookStatus } = useStatsApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getBookByCategory();
        const topBooksRes = await getTopBorrowedBooks();
        const statusRes = await getBookStatus();

        let formattedCategories = [];
        try {
          formattedCategories = Array.isArray(categoryRes.data?.categories) 
            ? categoryRes.data.categories 
            : Object.entries(categoryRes.data || {}).map(([name, value]) => ({ name, value: Number(value) }));
        } catch (err) {
          console.error("Error formatting category data:", err);
        }
        
        let formattedTopBooks = [];
        try {
          formattedTopBooks = Array.isArray(topBooksRes.data?.top_books)
            ? topBooksRes.data.top_books.map(book => ({
                title: book.name || "Untitled",
                borrowCount: Number(book.count) || 0
            }))
            : [];
        } catch (err) {
          console.error("Error formatting top books data:", err);
        }
        
        let formattedStatus = [];
        try {
          formattedStatus = Array.isArray(statusRes.data?.statuses)
            ? statusRes.data.statuses.map(item => ({
                status: item.status || "Unknown",
                value: Number(item.count) || 0
            }))
            : [];

          if (formattedStatus.length === 0) {
            formattedStatus = [
              { status: "Available", value: 0 },
              { status: "Borrowed", value: 0 },
              { status: "Maintenance", value: 0 }
            ];
          }
        } catch (err) {
          console.error("Error formatting status data:", err);
        }

        setBooksByCategory(formattedCategories);
        setTopBooks(formattedTopBooks);
        setBookStatus(formattedStatus);
      } catch (error) {
        console.error("Failed to fetch book stats:", error);
        setError("Lỗi khi tải dữ liệu thống kê sách");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setChartKey(prev => prev + 1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  const hasCategoryData = booksByCategory && booksByCategory.length > 0;
  const hasTopBooksData = topBooks && topBooks.length > 0;
  const hasStatusData = bookStatus && bookStatus.length > 0;


return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-white shadow rounded-lg text-center">      
        <h1 className="text-2xl font-bold mb-6">Thống Kê Sách</h1>
        
        {loading ? (
            <div className="text-center">Đang tải dữ liệu...</div>
        ) : error ? (
            <div className="text-center text-red-500">{error}</div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố sách theo danh mục</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {!hasCategoryData ? (
                            <div className="flex items-center justify-center h-full">Không có dữ liệu danh mục</div>
                        ) : (
                            <ResponsiveContainer key={`category-chart-${chartKey}`} width="99%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={booksByCategory}
                                        dataKey="count"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {(booksByCategory).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Top {Math.min(10, topBooks.length)} sách mượn nhiều nhất</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {!hasTopBooksData ? (
                            <div className="flex items-center justify-center h-full">Không có dữ liệu sách mượn</div>
                        ) : (
                            <ResponsiveContainer key={`topbooks-chart-${chartKey}`} width="99%" height={300}>
                                <BarChart 
                                    data={topBooks} 
                                    margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                                >
                                    <XAxis dataKey="title" height={60} angle={-45} textAnchor="end" interval={0} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="borrowCount" fill="#8884d8" name="Số lần mượn" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Tình trạng sách</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80" >
                        {!hasStatusData ? (
                            <div className="flex items-center justify-center h-full">Không có dữ liệu tình trạng</div>
                        ) : (
                            <ResponsiveContainer key={`status-chart-${chartKey}`} width="99%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={bookStatus}
                                        dataKey="value"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {bookStatus.map((entry, index) => (
                                            <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Thêm mới sách theo thời gian</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer key={`monthly-chart-${chartKey}`} width="99%" height={300}>
                            <BarChart 
                                data={[
                                    { month: '01/2023', count: 45 },
                                    { month: '02/2023', count: 32 },
                                    { month: '03/2023', count: 67 },
                                    { month: '04/2023', count: 28 },
                                    { month: '05/2023', count: 52 }
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#0088fe" name="Số sách" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
);
};

export default BookStats;