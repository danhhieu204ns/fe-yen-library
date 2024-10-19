import { useState } from 'react';
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logOut } from 'src/redux/auth/authSlice';
import useAuthPrivateApi from 'src/services/authService';

function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { changePassword } = useAuthPrivateApi();

    const validateForm = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Vui lòng nhập đầy đủ các trường.');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const result = await changePassword(formData);
        setLoading(false);

        if (result.status === 409) {
            setError('Mật khẩu hiện tại không chính xác.');
        } else if (result?.message) {
            toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại.');
            dispatch(logOut());
            navigate('/');
        } else {
            toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 w-full mt-14">
            <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
                </div>

                <form className="space-y-5" onSubmit={handleChangePassword}>
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Mật khẩu hiện tại
                        </label>
                        <Input.Password
                            id="currentPassword"
                            placeholder="Mật khẩu hiện tại"
                            size="large"
                            className="mt-2"
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            Mật khẩu mới
                        </label>
                        <Input.Password
                            id="newPassword"
                            placeholder="Mật khẩu mới"
                            size="large"
                            className="mt-2"
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Xác nhận mật khẩu mới
                        </label>
                        <Input.Password
                            id="confirmPassword"
                            placeholder="Xác nhận mật khẩu mới"
                            size="large"
                            className="mt-2"
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                        Đổi mật khẩu
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
