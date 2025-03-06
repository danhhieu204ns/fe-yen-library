// Sample data for reports

// Recent reports
export const recentReports = [
  {
    id: 1,
    name: "Báo cáo mượn trả T5/2023",
    date: "31/05/2023",
    type: "borrowing",
    fileUrl: "#"
  },
  {
    id: 2,
    name: "Báo cáo tồn kho Q2/2023",
    date: "15/05/2023",
    type: "inventory",
    fileUrl: "#"
  },
  {
    id: 3,
    name: "Báo cáo sách phổ biến 2023",
    date: "01/05/2023",
    type: "popular",
    fileUrl: "#"
  },
  {
    id: 4,
    name: "Báo cáo trễ hạn T4/2023",
    date: "30/04/2023",
    type: "overdue",
    fileUrl: "#"
  },
  {
    id: 5,
    name: "Báo cáo người dùng Q1/2023",
    date: "15/04/2023",
    type: "users",
    fileUrl: "#"
  }
];

// Sample report data for different report types
export const sampleReportData = {
  borrowing: {
    title: "Báo cáo mượn trả sách",
    data: [
      { date: "01/06/2023", bookTitle: "Đắc Nhân Tâm", borrower: "Nguyễn Văn A", status: "Đã trả", dueDate: "15/06/2023", returnDate: "14/06/2023" },
      { date: "03/06/2023", bookTitle: "Nhà Giả Kim", borrower: "Trần Thị B", status: "Đang mượn", dueDate: "17/06/2023", returnDate: null },
      { date: "05/06/2023", bookTitle: "Tội Ác Và Hình Phạt", borrower: "Lê Văn C", status: "Quá hạn", dueDate: "12/06/2023", returnDate: null },
      { date: "07/06/2023", bookTitle: "Chiến Tranh Và Hòa Bình", borrower: "Phạm Thị D", status: "Đã trả", dueDate: "21/06/2023", returnDate: "20/06/2023" },
      { date: "10/06/2023", bookTitle: "Sự Im Lặng Của Bầy Cừu", borrower: "Hoàng Văn E", status: "Đang mượn", dueDate: "24/06/2023", returnDate: null }
    ]
  },
  
  inventory: {
    title: "Báo cáo tồn kho",
    data: [
      { category: "Văn học", totalBooks: 458, availableBooks: 325, borrowedBooks: 133, reservedBooks: 25 },
      { category: "Khoa học", totalBooks: 310, availableBooks: 245, borrowedBooks: 65, reservedBooks: 12 },
      { category: "Lịch sử", totalBooks: 275, availableBooks: 198, borrowedBooks: 77, reservedBooks: 10 },
      { category: "Tâm lý học", totalBooks: 180, availableBooks: 120, borrowedBooks: 60, reservedBooks: 15 },
      { category: "Kinh tế", totalBooks: 320, availableBooks: 210, borrowedBooks: 110, reservedBooks: 30 }
    ]
  },
  
  popular: {
    title: "Báo cáo sách phổ biến",
    data: [
      { rank: 1, bookTitle: "Đắc Nhân Tâm", author: "Dale Carnegie", borrowCount: 87, avgRating: 4.8 },
      { rank: 2, bookTitle: "Nhà Giả Kim", author: "Paulo Coelho", borrowCount: 75, avgRating: 4.7 },
      { rank: 3, bookTitle: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", borrowCount: 68, avgRating: 4.5 },
      { rank: 4, bookTitle: "Hai Số Phận", author: "Jeffrey Archer", borrowCount: 62, avgRating: 4.6 },
      { rank: 5, bookTitle: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", borrowCount: 59, avgRating: 4.9 }
    ]
  },
  
  overdue: {
    title: "Báo cáo trễ hạn",
    data: [
      { borrower: "Nguyễn Văn A", bookTitle: "Đánh Thức Con Người Phi Thường", dueDate: "05/06/2023", daysOverdue: 5, fineAmount: 50000 },
      { borrower: "Trần Thị B", bookTitle: "Người Giàu Có Nhất Thành Babylon", dueDate: "03/06/2023", daysOverdue: 7, fineAmount: 70000 },
      { borrower: "Lê Văn C", bookTitle: "Tội Ác Và Hình Phạt", dueDate: "01/06/2023", daysOverdue: 9, fineAmount: 90000 },
      { borrower: "Phạm Thị D", bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu", dueDate: "04/06/2023", daysOverdue: 6, fineAmount: 60000 },
      { borrower: "Hoàng Văn E", bookTitle: "Đừng Bao Giờ Đi Ăn Một Mình", dueDate: "02/06/2023", daysOverdue: 8, fineAmount: 80000 }
    ]
  },
  
  users: {
    title: "Báo cáo người dùng",
    data: [
      { username: "nguyenvana", fullName: "Nguyễn Văn A", booksBorrowed: 12, booksReturned: 10, currentlyBorrowing: 2, overdue: 0 },
      { username: "tranthib", fullName: "Trần Thị B", booksBorrowed: 8, booksReturned: 7, currentlyBorrowing: 1, overdue: 0 },
      { username: "levanc", fullName: "Lê Văn C", booksBorrowed: 15, booksReturned: 12, currentlyBorrowing: 3, overdue: 1 },
      { username: "phamthid", fullName: "Phạm Thị D", booksBorrowed: 6, booksReturned: 6, currentlyBorrowing: 0, overdue: 0 },
      { username: "hoangvane", fullName: "Hoàng Văn E", booksBorrowed: 10, booksReturned: 8, currentlyBorrowing: 2, overdue: 1 }
    ]
  }
};
