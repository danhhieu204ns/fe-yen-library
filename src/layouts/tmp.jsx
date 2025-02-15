import { UserOutlined, LogoutOutlined, LockOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Avatar, Dropdown, Menu, Button } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from 'src/redux/auth/authSlice';
import { selectedCurrentUser } from 'src/redux/auth/authSlice';
import MenuItems from './itemsHeader';
import logo from 'src/assets/images/logo3.png';

const { Header, Content } = Layout;

function DefaultLayout() {
    const menuItems = MenuItems(); // Lấy menu items
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const dispatch = useDispatch();
    const user = useSelector(selectedCurrentUser);

    const findKeyByPath = (path) => {
        if (path.includes('login')) return 'login';
        if (path.includes('register')) return 'register';

        if (path.includes('search')) return 'search';
        if (path.includes('volunteer')) return 'volunteer';
        if (path.includes('schedule')) return 'schedule';
        if (path.includes('event')) return 'event';
        
        if (path.includes('manage-library')) return 'manage-library';
        if (path.includes('author')) return 'author';
        if (path.includes('genre')) return 'genre';
        if (path.includes('publisher')) return 'publisher';
        if (path.includes('bookgroup')) return 'bookgroup';
        if (path.includes('borrow')) return 'borrow';
        
        if (path.includes('manage-user')) return 'manage-user';
        return 'dashboard';
    };

    const defaultSelectedKeys = [findKeyByPath(currentPath)];

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/');
    };

    return (
        <div className="flex min-h-screen relative">
            <Layout>
                <Header className="flex justify-between z-10 fixed w-full px-4 bg-[#ffffff] border-b border-gray-200 shadow-slate-400">
                    <div className="flex items-center mx-3">
                        <Link to={'/'} className="flex items-center space-x-1">
                            <img className=" h-[40px] rounded" src={logo} alt="logo" />
                            <span className="text-xl text-black w-[180px] whitespace-nowrap overflow-hidden">
                                Không gian đọc Yên
                            </span>
                        </Link>
                    </div>
                    <Menu
                        style={{ minWidth: 0, flex: "auto" }}
                        items={menuItems}
                        mode="horizontal"
                        overflowedIndicator={<MenuOutlined />}
                        defaultSelectedKeys={defaultSelectedKeys}
                        selectedKeys={defaultSelectedKeys}
                    />
                    <div className="flex items-center">
                        {user ? (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'change-password',
                                            label: <Link to="/change-password">Đổi mật khẩu</Link>,
                                            icon: <LockOutlined />,
                                        },
                                        {
                                            key: 'logout',
                                            label: (
                                                <Button type="link" onClick={handleLogout}>
                                                    Đăng xuất
                                                </Button>
                                            ),
                                            icon: <LogoutOutlined />,
                                        },
                                    ],
                                }}
                            >
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <Avatar icon={<UserOutlined />} />
                                    <div className="whitespace-nowrap">{user.name}</div>
                                </div>
                            </Dropdown>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login">
                                    <Button
                                        type="primary"
                                        className="text-black rounded-lg"
                                        style={{
                                            width: '120px',
                                            height: '40px', // Tăng độ cao
                                            borderRadius: '20px', // Bo góc
                                            fontSize: '16px', // Tăng kích thước chữ nếu cần
                                        }}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link to="/register">
                                <Button
                                        type="default"
                                        className="text-white bg-black rounded-lg"
                                        style={{
                                            width: '120px',
                                            height: '40px', // Tăng độ cao
                                            borderRadius: '20px', // Bo góc
                                            fontSize: '16px', // Tăng kích thước chữ nếu cần
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </Header>
                <Content className="p-6 mt-[60px]">
                    <Outlet />
                </Content>
            </Layout>
        </div>
    );
}

export default DefaultLayout;
