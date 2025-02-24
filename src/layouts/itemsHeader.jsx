import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRoles } from '../redux/auth/authSlice';


const MenuItems = () => {
    const role = useSelector(selectCurrentRoles); // Lấy vai trò từ Redux store

    // Định nghĩa các mục menu
    const menuItems = [
        // {
        //     key: 'search',
        //     label: (
        //         <Link to={'/search'} className="flex items-center space-x-2">
        //             Tra cứu sách
        //         </Link>
        //     ),
        // },
        // {
        //     key: 'volunteer',
        //     label: (
        //         <Link to={'/volunteer'} className="flex items-center space-x-2">
        //             Thiện nguyện
        //         </Link>
        //     ),
        // },
        // {
        //     key: 'schedule',
        //     label: (
        //         <Link to={'/schedule'} className="flex items-center space-x-2">
        //             Lịch mở cửa
        //         </Link>
        //     ),
        // },
        // {
        //     key: 'event',
        //     label: (
        //         <Link to={'/event'} className="flex items-center space-x-2">
        //             Sự kiện
        //         </Link>
        //     ),
        // },

        // Chỉ thêm list sau nếu vai trò là 'admin'
        ...((role && role.includes('admin')) ? [
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
                    label: <Link to="/manage/category">Quản lý Thể loại sách</Link>,
                },
                {
                    key: 'bookshelf',
                    label: <Link to="/manage/bookshelf">Quản lý Kệ sách</Link>,
                },
                {
                    key: 'book',
                    label: <Link to="/manage/book">Quản lý Sách</Link>,
                },
                {
                    key: 'bookcopy',
                    label: <Link to="/manage/bookcopy">Quản lý Bản sao sách</Link>,
                },
                // {
                //     key: 'borrow',
                //     label: <Link to="/manage/borrow">Quản lý Mượn sách</Link>,
                // },
            ],
        },
        // {
        //     key: 'analize',
        //     label: (
        //         <div className="flex items-center space-x-2">
        //             <span>Thống kê số liệu</span>
        //             <DownOutlined />
        //         </div>
        //     ),
        //     children: [
        //         {
        //             key: '1',
        //             label: <Link to="/k/1">Thống kê</Link>,
        //         },
        //         {
        //             key: '2',
        //             label: <Link to="/k/2">Thống kê</Link>,
        //         },
        //         {
        //             key: '3',
        //             label: <Link to="/k/3">Thống kê</Link>,
        //         },
        //         {
        //             key: '4',
        //             label: <Link to="/k/4">Thống kê</Link>,
        //         },
        //         {
        //             key: '6',
        //             label: <Link to="/k/5">Thống kê</Link>,
        //         },
        //     ],
        // },
        {
            key: 'manage_user',
            label: (
                <Link to={'/manage/user'} className="flex items-center space-x-2">
                    Quản lý người dùng
                </Link>
            ),
        },

        ] : []), 
        
        // // Cho user
        // ...((role && role.includes('user')) ? [
        //     {
        //         key: 'my_book_cart',
        //         label: (
        //             <Link to={'/mybookcart'} className="flex items-center space-x-2">
        //                 Giỏ sách của tôi
        //             </Link>
        //         ),
        //     },
    
        // ] : []), // Nếu không phải user, trả về mảng rỗng
    ];

    return menuItems;
};

export default MenuItems;
