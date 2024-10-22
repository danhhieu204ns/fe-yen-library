import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input, Button } from 'antd';
import { useUserApi } from 'src/services/userService'; // Giả sử bạn có một hàm đăng ký
import { setCredentials } from 'src/redux/auth/authSlice';
import logo from 'src/assets/images/background-login.png';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        birthdate: '',
        address: '',
        phone_number: '',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { createUser } = useUserApi();

    const validateForm = () => {
        const { username, password, name, birthdate, address, phone_number } = formData;
        if (!username || !password || !name || !birthdate || !address || !phone_number) {
            setError('Tất cả các trường đều phải được điền.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const result = await createUser(formData); // Giả sử bạn đã định nghĩa hàm đăng ký
        setLoading(false);
        if (result?.detail === 400) {
            setError(`Đăng ký không thành công. ${result?.detail}`);
        } else if (result?.user) {
            dispatch(setCredentials(result)); // Nếu bạn cần lưu thông tin đăng ký
            setFormData({
                username: '',
                password: '',
                name: '',
                birthdate: '',
                address: '',
                phone_number: '',
            });
            navigate('/'); // Chuyển hướng đến trang chính sau khi đăng ký thành công
        } else {
            toast.error(`Đăng ký thất bại.  ${result?.detail}`);
        }
    };

    return (
        <div className="h-[80vh] space-y-8 bg-[#232627] rounded-2xl shadow-lg">
            <div className="flex h-full flex-row-reverse items-center justify-around">
                <div className="text-center w-1/2 h-full">
                    <img className='object-fill w-full h-full' src={logo} alt="Logo" />
                </div>
                <div className='w-1/2 h-full flex flex-col justify-center items-center gap-y-2 p-10'>
                    <h2 className="text-2xl font-bold text-white">Chào mừng đến với YÊN!</h2>
                    <h2 className="text-xl font-bold text-white">Đăng ký</h2>
                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div className="flex items-center mb-4">
                            <label className="text-white mr-2 w-1/4">Tên đăng nhập</label>
                            <Input
                                id="username"
                                placeholder="Tên đăng nhập"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="text-white mr-2 w-1/4">Mật khẩu</label>
                            <Input.Password
                                id="password"
                                placeholder="Mật khẩu"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="text-white mr-2 w-1/4">Họ và tên</label>
                            <Input
                                id="name"
                                placeholder="Họ và tên"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="text-white mr-2 w-1/4">Ngày sinh</label>
                            <Input
                                id="birthdate"
                                type="date" // Hoặc type="date" nếu bạn muốn
                                placeholder="Ngày sinh (YYYY-MM-DD)"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="text-white mr-2 w-1/4">Địa chỉ</label>
                            <Input
                                id="address"
                                placeholder="Địa chỉ"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="text-white mr-2 w-1/4">Số điện thoại</label>
                            <Input
                                id="phone_number"
                                placeholder="Số điện thoại"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            />
                        </div>

                        {error && <div className="text-red-500">{error}</div>}

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full text-black py-2 mt-4 text-lg font-semibold"
                            style={{
                                backgroundColor: '#fadf03',
                                borderColor: '#fadf03',
                                height: '45px',
                                borderRadius: '20px', // Bo góc
                            }}
                            loading={loading}
                        >
                            Đăng ký
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
