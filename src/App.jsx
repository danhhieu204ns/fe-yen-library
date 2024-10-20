import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './components/auth/ChangePassword';

import ManageStudent from './components/manage_student/ManageStudent';
import ManageSemester from './components/manage_info/ManageSemester/ManageSemester';
import ManageGrade from './components/manage_info/ManageGrade/ManageGrade';
import ManageAbsentByStudent from './components/manage_absent/by_student/ManageAbsentByStudent';
import ManageAbsentBySubject from './components/manage_absent/by_subject/ManageAbsentBySubject';
import ManageAbsentBySubjectCrawl from './components/manage_absent/by_subject_crawl/ManageAbsentBySubject';
import CreateSemester from './components/manage_info/ManageSemester/CreateSemester';
import EditSemester from './components/manage_info/ManageSemester/EditSemester';
import CreateBookgroup from './components/manage_info/ManageBookgroup/CreateBookgroup';
import EditBookgroup from './components/manage_info/ManageBookgroup/EditBookgroup';
import CreateGenre from './components/manage_info/ManageGenre/CreateGenre';
import EditGenre from './components/manage_info/ManageGenre/EditGenre';
import ManageFeeByStudent from './components/manage_fee/by_student/ManageFeeByStudent';
import ManageAbsentByClass from './components/manage_absent/by_class/ManageAbsentByClass';
import ManageLecturer from './components/manage-lecturer/ManageLecturer';
import ManageSchedule from './components/manage_schedule/ManageSchedule';
import ManageFeeByClass from './components/manage_fee/by_class/ManageFeeByClass';
import RequireAuth from './components/auth/RequireAuth';

import ManageUser from './components/manage_user/ManageUser';
import ManageRetake from './components/manage_retake/ManageRetake';

import SearchContainer from './components/search/Search'
import SearchBookComponentByName from './components/search/bytensach';
import SearchBookComponentByAuthor from './components/search/bytentacgia';
import SearchBookComponentByGenre from './components/search/bytheloai';


import HomeComponent from './components/Home';
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
                    {/* <Route element={<RequireAuth />}> */}
                    <Route element={<DefaultLayout />}>
                        <Route path="/" element={<HomeComponent/>} />

                        {/* me */}
                        <Route path="/change-password" element={<ChangePassword />} />

                        {/* Search */}
                        <Route path="/search" element={<SearchContainer />}>
                            <Route path="/search/by-name" element={<SearchBookComponentByName />} />
                            <Route path="/search/by-author" element={<SearchBookComponentByAuthor />} />
                            <Route path="/search/by-genre" element={<SearchBookComponentByGenre />} />
                        </Route>

                        {/* manage-info */}
                        <Route path="/manage/author" element={<ManageAuthor />} />
                        <Route path="/manage/publisher" element={<ManagePublisher />} />
                        <Route path="/manage/genre" element={<ManageGenre />} />
                        <Route path="/manage/bookgroup" element={<ManageBookgroup />} />
                        {/* <Route path="/manage/book" element={<ManageSemester />} /> */}
                        <Route path="/manage/borrow" element={<ManageBorrow />} />


                        <Route path="/manage/semester/create" element={<CreateSemester />} />
                        <Route path="/manage/semester/edit/:id" element={<EditSemester />} />

                        <Route path="/manage/grade" element={<ManageGrade />} />

                        {/* <Route path="/manage/class" element={<ManageClass />} />
                        <Route path="/manage/class/create" element={<CreateClass />} />
                        <Route path="/manage/class/edit/:id" element={<EditClass />} /> */}

                        {/* <Route path="/manage/subject" element={<ManageSubject />} />
                        <Route path="/manage/subject/create" element={<CreateSubject />} />
                        <Route path="/manage/subject/edit/:id" element={<EditSubject />} /> */}

                        {/* manage_student */}
                        <Route path="/manage-student" element={<ManageStudent />} />

                        {/* manage_library */}
                        <Route path="/manage-absent/student" element={<ManageAbsentByStudent />} />
                        <Route path="/manage-absent/class" element={<ManageAbsentByClass />} />
                        <Route path="/manage-absent/subject" element={<ManageAbsentBySubject />} />
                        <Route path="/manage-absent/subject-crawl" element={<ManageAbsentBySubjectCrawl />} />

                        {/* manage_fee */}
                        {/* <Route path="/manage-fee/student" element={<ManageFeeByStudent />} />
                        <Route path="/manage-fee/class" element={<ManageFeeByClass />} />
                        <Route path="/manage-fee/class" element={<ManageAbsentBySubject />} /> */}

                        {/* manage-lecturer */}
                        {/* <Route path="/manage-lecturer" element={<ManageLecturer />} /> */}

                        {/* manage-teaching */}
                        {/* <Route path="/manage-teaching/lecturer" element={<ManageLecturer />} />
                        <Route path="/manage-teaching/schedule" element={<ManageSchedule />} /> */}

                        {/* manage-retake */}
                        {/* <Route path="/manage-retake" element={<ManageRetake />} /> */}

                        {/* manage-user */}
                        {/* <Route path="/manage-user" element={<ManageUser />} /> */}

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route path="*" element={<h1 className="w-full h-screen d-flex-center text-6xl">Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
