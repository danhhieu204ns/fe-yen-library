import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from './layouts/DefaultLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './components/auth/ChangePassword';
import ManageUser from './components/ManageUser/ManageUser';

import HomeComponent from './components/Home';
import SearchBook from './components/Search/Search'
import MyBookCart from './components/MyBookCart/MyBookCart';

import ManageAuthor from './components/ManageAuthor/ManageAuthor';
import ManagePublisher from './components/ManagePublisher/ManagePublisher';
import ManageBook from './components/ManageBook/ManageBook';
import ManageGenre from './components/ManageGenre/ManageGenre';
import ManageBorrow from './components/ManageBorrow/ManageBorrow';


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
                        <Route path="/search" element={<SearchBook />} />

                        {/* input */}
                        <Route path="/input/author" element={<ManageAuthor />} />
                        <Route path="/input/publisher" element={<ManagePublisher />} />
                        <Route path="/input/genre" element={<ManageGenre />} />
                        <Route path="/input/book" element={<ManageBook />} />

                        {/* manage_library */}
                        <Route path="/manage/borrow" element={<ManageBorrow />} />

                        {/* manage-user */}
                        <Route path="/manage-user" element={<ManageUser />} />

                        {/* me */}
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/mybookcart" element={<MyBookCart />} />
                        

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route path="*" element={<h1 className="w-full h-screen d-flex-center text-6xl">Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
