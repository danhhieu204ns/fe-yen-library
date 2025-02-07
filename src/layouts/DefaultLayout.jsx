import React, { useState } from 'react'; // Nhập useState
import { Outlet, useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserOutlined, LogoutOutlined, LockOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Avatar, Dropdown, Menu, Button, Modal } from 'antd';
import { selectedCurrentUser } from 'src/redux/auth/authSlice';
import { logOut } from 'src/redux/auth/authSlice';
import MenuItems from './itemsHeader';
import Register from '../pages/Register'; // Nhập component Register
import Login from '../pages/Login'; // Nhập component Login
import logo from 'src/assets/images/logo3.png';

const { Header, Content } = Layout;

function DefaultLayout() {
    const menuItems = MenuItems();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const dispatch = useDispatch();
    const user = useSelector(selectedCurrentUser);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

    const findKeyByPath = (path) => {
        if (path.includes('search')) return 'search';
        if (path.includes('volunteer')) return 'volunteer';
        if (path.includes('schedule')) return 'schedule';
        if (path.includes('event')) return 'event';
        if (path.includes('input')) return 'input';
        if (path.includes('manage')) return 'manage';
        if (path.includes('analize')) return 'analize';
        if (path.includes('mybookcart')) return 'my_book_cart';
        if (path.includes('manage/user')) return 'manage_user';
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
                            <img className=" h-[40px] rounded pr-[16px]" src={logo} alt="logo" />
                            <span className="text-xl text-black w-[180px] whitespace-nowrap overflow-hidden">
                                Không gian đọc Yên
                            </span>
                        </Link>
                    </div>
                    <Menu //className="bg-transparent"
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
                                <Button
                                    type="primary"
                                    className="text-black rounded-lg"
                                    onClick={() => setIsLoginModalVisible(true)}
                                    style={{
                                        width: '120px',
                                        height: '40px',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                                <Button
                                    type="default"
                                    className="text-white bg-black rounded-lg"
                                    onClick={() => setIsRegisterModalVisible(true)}
                                    style={{
                                        width: '120px',
                                        height: '40px',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </div>
                </Header>
                <Content className="" >
                    <Outlet />
                </Content>
            </Layout>

            {/* Modal cho Login */}
            <Modal
                open={isLoginModalVisible}
                onCancel={() => setIsLoginModalVisible(false)}
                footer={null}
                width={730}
                styles={{
                    content: {
                        padding: 0, 
                        borderRadius: '20px'
                }}}
            >
                <Login 
                    closeModal={() => setIsLoginModalVisible(false)} 
                />
            </Modal>

            {/* Modal cho Register */}
            <Modal
                open={isRegisterModalVisible}
                onCancel={() => setIsRegisterModalVisible(false)}
                footer={null}
                width={730}
                styles={{
                    content: {
                        padding: 0, 
                        borderRadius: '20px'
                }}}
            >
                <Register closeModal={() => setIsRegisterModalVisible(false)} />
            </Modal>
        </div>
    );
}

export default DefaultLayout;
