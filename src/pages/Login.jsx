import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Input, Button } from 'antd';
import { setCredentials } from 'src/redux/auth/authSlice';
import { login } from 'src/services/authService';
import logo from 'src/assets/images/logo-yen.png';
import loginBackground from '../assets/images/login.png'


function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateForm = () => {
        if (!formData.username || !formData.password) {
            setError('Tên đăng nhập và mật khẩu không được để trống.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const result = await login(formData);
        setLoading(false);
        if (result.user) {
            dispatch(setCredentials(result));
            setFormData({ username: '', password: '' });
            navigate('/');
        }
        else if (result.detail) {
            setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        } else {
            toast.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <div style={{backgroundImage: `url(${loginBackground})`}} className="flex items-center justify-center min-h-screen w-full bg-cover">
            <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <img src={logo} alt="Đại Nam University Logo" className="w-28 mx-auto" />
                    <h2 className="mt-6 text-xl font-bold text-gray-900">Đăng nhập tài khoản</h2>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Tên đăng nhập
                        </label>
                        <Input
                            id="username"
                            placeholder="Tên đăng nhập"
                            size="large"
                            className="mt-2"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <Input.Password
                            id="password"
                            placeholder="Mật khẩu"
                            size="large"
                            className="mt-2"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}

                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full py-2 mt-4 text-lg font-semibold"
                        style={{
                            backgroundColor: '#FF7A00',
                            borderColor: '#FF7A00',
                            height: '45px',
                        }}
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;
