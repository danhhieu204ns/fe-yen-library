import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";
import { recentReports, sampleReportData } from "@/data/reportsMockData";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("borrowing");
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = async () => {
    // Validate dates
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }
    
    // Call to API would go here
    console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
    
    // Show preview
    setShowPreview(true);
  };

  const renderReportPreview = () => {
    const reportData = sampleReportData[reportType];
    
    if (!reportData) return null;
    
    const renderTable = () => {
      switch (reportType) {
        case "borrowing":
          return (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ngày mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sách</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Người mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Hạn trả</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.date}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.bookTitle}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.borrower}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.status}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        case "inventory":
          return (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Danh mục</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tổng số</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Có sẵn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Đang mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Đặt trước</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.category}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.totalBooks}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.availableBooks}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.borrowedBooks}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.reservedBooks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        case "popular":
          return (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Xếp hạng</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tên sách</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tác giả</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Lượt mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.rank}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.bookTitle}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.author}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.borrowCount}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.avgRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        case "overdue":
          return (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Người mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sách</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ngày hết hạn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Số ngày trễ</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tiền phạt (VND)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.borrower}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.bookTitle}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.dueDate}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.daysOverdue}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.fineAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        case "users":
          return (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Username</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Họ tên</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Đã mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Đã trả</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Đang mượn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trễ hạn</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.username}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.fullName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.booksBorrowed}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.booksReturned}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.currentlyBorrowing}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.overdue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        default:
          return null;
      }
    };
    
    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{reportData.title}</CardTitle>
          <button className="text-blue-600 hover:text-blue-800 flex items-center">
            <Download className="mr-1 h-5 w-5" />
            Tải xuống
          </button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {renderTable()}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Báo Cáo Thống Kê</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tạo báo cáo mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Loại báo cáo</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="borrowing">Báo cáo mượn trả</option>
                  <option value="inventory">Báo cáo tồn kho</option>
                  <option value="popular">Sách phổ biến</option>
                  <option value="overdue">Báo cáo trễ hạn</option>
                  <option value="users">Báo cáo người dùng</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Từ ngày</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 pl-10 border rounded-md"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Đến ngày</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 pl-10 border rounded-md"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Xem trước báo cáo
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentReports.map((report) => (
                <li key={report.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{report.name}</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">{report.date}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {showPreview && renderReportPreview()}
    </div>
  );
};

export default Reports;