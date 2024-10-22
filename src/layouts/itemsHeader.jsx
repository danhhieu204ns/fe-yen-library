import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../redux/auth/authSlice';


const MenuItems = () => {
    const role = useSelector(selectCurrentRole); // Lấy vai trò từ Redux store

    // Định nghĩa các mục menu
    const menuItems = [
        {
            key: 'search',
            label: (
                <Link to={'/search'} className="flex items-center space-x-2">
                    Tra cứu sách
                </Link>
            ),
        },
        {
            key: 'volunteer',
            label: (
                <Link to={'/volunteer'} className="flex items-center space-x-2">
                    Thiện nguyện
                </Link>
            ),
        },
        {
            key: 'schedule',
            label: (
                <Link to={'/schedule'} className="flex items-center space-x-2">
                    Lịch mở cửa
                </Link>
            ),
        },
        {
            key: 'event',
            label: (
                <Link to={'/event'} className="flex items-center space-x-2">
                    Sự kiện
                </Link>
            ),
        },

        // Chỉ thêm 'manage_library' nếu vai trò là 'admin'
        ...(role === 'admin' ? [
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
                    label: <Link to="/manage/genre">Quản lý Thể loại sách</Link>,
                },
                {
                    key: 'bookgroup',
                    label: <Link to="/manage/bookgroup">Quản lý Nhóm sách</Link>,
                },
                {
                    key: 'book',
                    label: <Link to="/manage/book">Quản lý Sách</Link>,
                },
                {
                    key: 'borrow',
                    label: <Link to="/manage/borrow">Quản lý Mượn sách</Link>,
                },
            ],
        },
        {
            key: 'analize_library',
            label: (
                <div className="flex items-center space-x-2">
                    <span>Thống kê</span>
                    <DownOutlined />
                </div>
            ),
            children: [
                {
                    key: '1',
                    label: <Link to="/k/1">Quản lý Tác giả</Link>,
                },
                {
                    key: '2',
                    label: <Link to="/k/2">Quản lý Nhà xuất bản</Link>,
                },
                {
                    key: '3',
                    label: <Link to="/k/3">Quản lý Thể loại sách</Link>,
                },
                {
                    key: '4',
                    label: <Link to="/k/4">Quản lý Nhóm sách</Link>,
                },
                {
                    key: '5',
                    label: <Link to="/k/5">Quản lý Sách</Link>,
                },
                {
                    key: '6',
                    label: <Link to="/k/5">Quản lý Mượn sách</Link>,
                },
            ],
        },

        ] : []), // Nếu không phải admin, trả về mảng rỗng
    ];

    return menuItems;
};

export default MenuItems;
