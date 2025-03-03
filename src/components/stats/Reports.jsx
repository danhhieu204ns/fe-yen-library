import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download } from "lucide-react";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("borrowing");

  const handleGenerateReport = async () => {
    // Call to API would go here
    console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
    
    // Simulate API call
    alert(`Report is being generated. You'll receive it shortly.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
                  <Download className="mr-2 h-5 w-5" />
                  Tạo báo cáo
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
              {[
                { name: "Báo cáo mượn trả T5/2023", date: "31/05/2023" },
                { name: "Báo cáo tồn kho Q2/2023", date: "15/05/2023" },
                { name: "Báo cáo sách phổ biến 2023", date: "01/05/2023" },
                { name: "Báo cáo trễ hạn T4/2023", date: "30/04/2023" }
              ].map((report, index) => (
                <li key={index} className="border-b pb-2">
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
    </div>
  );
};

export default Reports;