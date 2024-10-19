import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const menuItems = [
    {
        key: 'search',
        label: (
            <div className="flex items-center space-x-2">
                <span>Tra cứu sách</span>
                <DownOutlined />
            </div>
        ),
        children: [
            {
                label: <Link to="/search/by-name">Tra cứu theo tên sách</Link>,
                key: 'by-name',
            },
            {
                label: <Link to="/search/by-author">Tra cứu theo tên tác giả</Link>,
                key: 'by-author',
            },
            {
                label: <Link to="/search/by-genre">Tra cứu theo tên thể loại</Link>,
                key: 'by-genre',
            },
        ],
    },
    {
        key: 'manage_infor',
        label: (
            <div className="flex items-center space-x-2">
                <span>Thiện nguyện</span>
                <DownOutlined />
            </div>
        ),
        children: [
            {
                key: 'manage-school-years',
                label: <Link to="manage/school-year">Quản lý năm học</Link>,
            },
           
        ],
    },
    // {
    //     key: 'manage-student',
    //     label: <Link to="/manage-student">Quản lý sinh viên</Link>,
    // },
    {
        key: 'manage-absent',
        label: (
            <div className="flex items-center space-x-2">
                <span>Lịch mở cửa</span>
                <DownOutlined />
            </div>
        ),
        children: [
            {
                key: 'manage-absent-by-student',
                label: <Link to="manage-absent/student">Theo sinh viên</Link>,
            },
            {
                key: 'manage-absent-by-class',
                label: <Link to="manage-absent/class">Theo lớp</Link>,
            },
            {
                key: 'manage-absent-by-subject',
                label: <Link to="manage-absent/subject">Theo môn học</Link>,
            },
            {
                key: 'manage-absent-by-subject-crawl',
                label: <Link to="manage-absent/subject-crawl">Theo môn học (Crawl)</Link>,
            },
        ],
    },
    {
        key: 'manage-fee',
        label: (
            <div className="flex items-center space-x-2">
                <span>Sự kiện</span>
                <DownOutlined />
            </div>
        ),
        children: [
            {
                key: 'manage-fee-by-student',
                label: <Link to="manage-fee/student">Theo sinh viên</Link>,
            },
            {
                key: 'manage-fee-by-class',
                label: <Link to="manage-fee/class">Theo lớp</Link>,
            },
        ],
    },
    {
        key: 'manage_library',
        label: (
            <div className="flex items-center space-x-2">
                <span>Quản lý Thư viện</span>
                <DownOutlined />
            </div>
        ),
        children: [
            {
                key: 'author',
                label: <Link to="/manage/author">Quản lý Tác giả</Link>,
            },
            {
                key: 'publisher',
                label: <Link to="/manage/publisher">Quản lý Nhà xuất bản</Link>,
            },
            {
                key: 'genre',
                label: <Link to="manage/genre">Quản lý Thể loại sách</Link>,
            },
            {
                key: 'bookgroup',
                label: <Link to="manage/bookgroup">Quản lý Nhóm sách</Link>,
            },
            {
                key: 'book',
                label: <Link to="manage/book">Quản lý Sách</Link>,
            },
        ],
    },
    // {
    //     key: 'manage-teaching',
    //     label: (
    //         <div className="flex items-center space-x-2">
    //             <span>Quản lý giảng dạy</span>
    //             <DownOutlined />
    //         </div>
    //     ),
    //     children: [
    //         {
    //             key: 'manage-lecturer',
    //             label: <Link to="manage-teaching/lecturer">Quản lý giảng viên</Link>,
    //         },
    //         {
    //             key: 'manage-schedule',
    //             label: <Link to="manage-teaching/schedule">Quản lý lịch giảng dạy</Link>,
    //         },    
    //     ]
    // },
    // {
    //     key: 'manage-retake',
    //     label: <Link to="/manage-retake">Quản lý học lại</Link>,
    // },
    // {
    //     key: 'manage-user',
    //     label: <Link to="/manage-user">Quản lý người dùng</Link>,
    // },
];
