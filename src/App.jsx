import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import RequireAuth from './components/auth/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './components/auth/ChangePassword';
import ManageUser from './components/manage_user/ManageUser';

import HomeComponent from './components/Home';

import SearchBook from './components/search/Search'
import SearchBookComponentByName from './components/search/bytensach';
import SearchBookComponentByAuthor from './components/search/bytentacgia';
import SearchBookComponentByGenre from './components/search/bytheloai';

import ManageAuthor from './components/manage_info/ManageAuthor/ManageAuthor';
import ManagePublisher from './components/manage_info/ManagePublisher/ManagePublisher';
import ManageBookgroup from './components/manage_info/ManageBookgroup/ManageBookgroup';
import ManageGenre from './components/manage_info/ManageGenre/ManageGenre';
import ManageBorrow from './components/manage_info/ManageBorrow/ManageBorrow';


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
                <Routes>
                    <Route element={<DefaultLayout />}>
                        {/* Home */}
                        <Route path="/" element={<HomeComponent/>} />

                        {/* Search */}
                        <Route path="/search" element={<SearchBook />}>
                        </Route>

                        {/* manage_library */}
                        <Route element={<RequireAuth />}>
                            {/* manage-info */}
                            <Route path="/manage/author" element={<ManageAuthor />} />
                            <Route path="/manage/publisher" element={<ManagePublisher />} />
                            <Route path="/manage/genre" element={<ManageGenre />} />
                            <Route path="/manage/bookgroup" element={<ManageBookgroup />} />
                            {/* <Route path="/manage/book" element={<ManageSemester />} /> */}
                            <Route path="/manage/borrow" element={<ManageBorrow />} />
                        </Route>

                        {/* manage-user */}
                        {/* <Route path="/manage-user" element={<ManageUser />} /> */}

                        {/* me */}
                        <Route path="/change-password" element={<ChangePassword />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route path="*" element={<h1 className="w-full h-screen d-flex-center text-6xl">Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
