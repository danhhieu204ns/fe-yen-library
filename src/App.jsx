import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DefaultLayout from './layouts/DefaultLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './components/auth/ChangePassword';

import ManageUser from './components/ManageUser/ManageUser';

import HomeComponent from './components/Home';
import BookSearch from './components/BookSearch/BookSearch';
import Volunteer from './components/Volunteer/Volunteer'
import Schedule from './components/Schedule/Schedule'
import Event from './components/Event/Event'
import MyBookCart from './components/MyBookCart/MyBookCart';

import ManageAuthor from './components/InputAuthor/ManageAuthor';
import ManagePublisher from './components/InputPublisher/ManagePublisher';
import ManageBook from './components/InputBook/ManageBook';
import ManageCategory from './components/InputCategory/ManageCategory';
import ManageBookshelf from './components/ManageBookshelf/ManageBookshelf';
import ManageBookCopy from './components/ManageBookCopy/ManageBookCopy';
import ManageBorrow from './components/ManageBorrow/ManageBorrow';

import Dashboard from './components/stats/Dashboard';
import BookStats from './components/stats/BookStats';
import BorrowingStats from './components/stats/BorrowingStats';
import MonthlyStats from './components/stats/MonthlyStats';
import Reports from './components/stats/Reports';
import UserStats from './components/stats/UserStats';
import TopBooks from './components/stats/TopBooks';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SessionExpiryHandler from './components/SessionExpiryHandler';

export default function App() {
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
            <BrowserRouter>
                {/* Component này giám sát phiên làm việc */}
                <SessionExpiryHandler />
                <Routes>
                    {/* Route công khai */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<DefaultLayout />}>
                        {/* Default */}
                        <Route path="/" element={<HomeComponent/>} />
                        <Route path="/search" element={<BookSearch />} />
                        <Route path="/volunteer" element={<Volunteer/>} />
                        <Route path="/schedule" element={<Schedule/>} />
                        <Route path="/event" element={<Event/>} />
                        
                        {/* manage_library */}
                        <Route path="/manage/author" element={<ManageAuthor />} />
                        <Route path="/manage/publisher" element={<ManagePublisher />} />
                        <Route path="/manage/category" element={<ManageCategory />} />
                        <Route path="/manage/book" element={<ManageBook />} />
                        <Route path="/manage/bookshelf" element={<ManageBookshelf />} />
                        <Route path="/manage/bookcopy" element={<ManageBookCopy />} />
                        <Route path="/manage/borrow" element={<ManageBorrow />} />
                        <Route path="/manage/user" element={<ManageUser />} />

                        {/* stats */}
                        <Route path="/stats/dashboard" element={<Dashboard />} />
                        <Route path="/stats/books" element={<BookStats />} />
                        <Route path="/stats/borrowing" element={<BorrowingStats />} />
                        <Route path="/stats/monthly" element={<MonthlyStats />} />
                        <Route path="/stats/reports" element={<Reports />} />
                        <Route path="/stats/users" element={<UserStats />} />
                        <Route path="/stats/top-books" element={<TopBooks />} />

                        {/* me */}
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/mybookcart" element={<MyBookCart />} />
                        
                    </Route>
                    {/* Route được bảo vệ yêu cầu đăng nhập */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Thêm các protected routes khác ở đây */}
                    </Route>
                    <Route path="*" element={<h1 className="w-full h-screen d-flex-center text-6xl">Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
