// Sample data for user statistics

// Top users by borrowing activity
export const userActivity = [
  { id: 1, name: "Nguyễn Văn A", borrowCount: 15, returnCount: 12, overdueCount: 1 },
  { id: 2, name: "Trần Thị B", borrowCount: 12, returnCount: 10, overdueCount: 0 },
  { id: 3, name: "Lê Văn C", borrowCount: 10, returnCount: 8, overdueCount: 2 },
  { id: 4, name: "Phạm Thị D", borrowCount: 9, returnCount: 9, overdueCount: 0 },
  { id: 5, name: "Hoàng Văn E", borrowCount: 8, returnCount: 7, overdueCount: 0 },
  { id: 6, name: "Đặng Thu F", borrowCount: 7, returnCount: 5, overdueCount: 1 },
  { id: 7, name: "Vũ Minh G", borrowCount: 6, returnCount: 6, overdueCount: 0 },
  { id: 8, name: "Mai Anh H", borrowCount: 5, returnCount: 4, overdueCount: 0 }
];

// Age distribution of users
export const ageDistribution = [
  { age: "10-18", value: 120, percentage: "17%" },
  { age: "19-24", value: 250, percentage: "36%" },
  { age: "25-34", value: 180, percentage: "26%" },
  { age: "35-50", value: 90, percentage: "13%" },
  { age: "50+", value: 60, percentage: "8%" }
];

// Monthly registration trend
export const registrationTrend = [
  { month: "01/2023", count: 20, activeUsers: 18 },
  { month: "02/2023", count: 25, activeUsers: 22 },
  { month: "03/2023", count: 18, activeUsers: 15 },
  { month: "04/2023", count: 32, activeUsers: 28 },
  { month: "05/2023", count: 28, activeUsers: 25 },
  { month: "06/2023", count: 36, activeUsers: 31 }
];

// User status distribution
export const userStatusDistribution = [
  { status: "Hoạt động", value: 350, color: "#82ca9d" },
  { status: "Không hoạt động", value: 120, color: "#8884d8" },
  { status: "Mới", value: 80, color: "#ffc658" },
  { status: "Bị khóa", value: 15, color: "#ff8042" }
];

// User type distribution
export const userTypeDistribution = [
  { type: "Sinh viên", value: 280, color: "#0088fe" },
  { type: "Giảng viên", value: 120, color: "#00C49F" },
  { type: "Cán bộ", value: 95, color: "#FFBB28" },
  { type: "Khác", value: 70, color: "#FF8042" }
];

// Gender distribution
export const genderDistribution = [
  { gender: "Nam", value: 310, percentage: "55%" },
  { gender: "Nữ", value: 250, percentage: "44%" },
  { gender: "Khác", value: 5, percentage: "1%" }
];

// User activity by time of day
export const activityByTimeOfDay = [
  { time: "8:00 - 10:00", count: 45 },
  { time: "10:00 - 12:00", count: 65 },
  { time: "12:00 - 14:00", count: 40 },
  { time: "14:00 - 16:00", count: 85 },
  { time: "16:00 - 18:00", count: 70 },
  { time: "18:00 - 20:00", count: 55 }
];

// Most active days
export const activityByDayOfWeek = [
  { day: "Thứ 2", count: 68 },
  { day: "Thứ 3", count: 72 },
  { day: "Thứ 4", count: 85 },
  { day: "Thứ 5", count: 90 },
  { day: "Thứ 6", count: 95 },
  { day: "Thứ 7", count: 45 },
  { day: "Chủ nhật", count: 30 }
];

// User feedback ratings
export const userFeedbackData = [
  { rating: "5 sao", count: 120 },
  { rating: "4 sao", count: 85 },
  { rating: "3 sao", count: 45 },
  { rating: "2 sao", count: 25 },
  { rating: "1 sao", count: 10 }
];
