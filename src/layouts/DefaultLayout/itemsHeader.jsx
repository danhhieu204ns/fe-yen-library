import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../redux/auth/authSlice';

const MenuItems = () => {
    const role = useSelector(selectCurrentRole); // Lấy vai trò từ Redux store

    // Định nghĩa các mục menu
    const menuItems = [
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
            key: 'thiennguyen',
            label: (
                <div className="flex items-center space-x-2">
                    <span>Thiện nguyện</span>
                    <DownOutlined />
                </div>
            ),
            children: [],
        },
        {
            key: 'lichmocua',
            label: (
                <div className="flex items-center space-x-2">
                    <span>Lịch mở cửa</span>
                    <DownOutlined />
                </div>
            ),
            children: [],
        },
        {
            key: 'event',
            label: (
                <div className="flex items-center space-x-2">
                    <span>Sự kiện</span>
                    <DownOutlined />
                </div>
            ),
            children: [],
        },
        // Chỉ thêm 'manage_library' nếu vai trò là 'admin'
        ...(role === 'admin' ? [{
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
        }] : []), // Nếu không phải admin, trả về mảng rỗng
    ];

    return menuItems;
};

export default MenuItems;
