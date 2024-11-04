import React, { useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input, Button } from 'antd';
import { login, loginFace } from 'src/services/authService';
import { setCredentials } from 'src/redux/auth/authSlice';
import logo from 'src/assets/images/background-login.png';

function Login({ closeModal }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        if (result.status === 401) {
            setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        } else if (result?.user) {
            dispatch(setCredentials(result));
            setFormData({ username: '', password: '' });
            closeModal();
            navigate('/');
        } else {
            toast.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }
    };

    // Chức năng đăng nhập bằng khuôn mặt
    const handleFaceLogin = async (base64Image) => {
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            if (base64Image) {
                formDataToSend.append('image', base64Image);
            }
            const result = await loginFace(formDataToSend);
            setLoading(false);
            if (result?.user) {
                dispatch(setCredentials(result));
                closeModal();
                navigate('/');
            } else {
                toast.error('Đăng nhập bằng khuôn mặt thất bại.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const webcamRef = React.useRef(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        handleFaceLogin(imageSrc);
        setShowCamera(false);
    }, [webcamRef]);

    return (
        <div className="h-[80vh] space-y-8 bg-[#232627] rounded-2xl shadow-lg">
            <div className="flex h-full flex-row-reverse items-center justify-around">
                <div className="text-center w-1/2 h-full">
                    <img className="object-fill w-full h-full" src={logo} alt="Logo" />
                </div>
                <div className="w-1/2 h-full flex flex-col justify-center items-center gap-y-2 p-10">
                    <h2 className="text-2xl font-bold text-white">Chào mừng đến với YÊN!</h2>
                    <h2 className="text-xl font-bold text-white">Đăng nhập</h2>
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div className="flex items-center mb-4">
                            <label htmlFor="username" className="text-white mr-2 w-1/4">Tên đăng nhập</label>
                            <Input
                                id="username"
                                placeholder="Tên đăng nhập"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label htmlFor="password" className="text-white mr-2 w-1/4">Mật khẩu</label>
                            <Input.Password
                                id="password"
                                placeholder="Mật khẩu"
                                size="large"
                                className="w-3/4 mt-2"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {error && <div className="text-red-500">{error}</div>}

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full text-black py-2 mt-4 rounded-lg text-lg font-semibold"
                            style={{
                                backgroundColor: '#fadf03',
                                borderColor: '#fadf03',
                                height: '45px',
                                borderRadius: '20px',
                            }}
                            loading={loading}
                        >
                            Đăng nhập
                        </Button>
                    </form>
                    <label className='text-white pt-4'>Hoặc</label>
                    {/* Nút đăng nhập bằng khuôn mặt */}
                    <Button
                        onClick={() => setShowCamera(true)}
                        className="w-full text-black py-2 mt-4 rounded-lg text-lg font-semibold"
                        style={{
                            backgroundColor: '#fadf03',
                            borderColor: '#fadf03',
                            height: '45px',
                            borderRadius: '20px',
                        }}
                    >
                        Đăng nhập bằng khuôn mặt
                    </Button>

                    {/* Hiển thị camera khi showCamera = true */}
                    {showCamera && (
                        <div className="camera">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                height="100%"
                            />
                            <Button onClick={capture} className="mt-2">Chụp ảnh</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
