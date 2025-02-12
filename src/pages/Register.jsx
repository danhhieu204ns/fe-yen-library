import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input, Button } from 'antd';
import { useUserApi } from 'src/services/userService';
import { setCredentials } from 'src/redux/auth/authSlice';

function Register({ closeModal }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
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
        const { username, password, full_name, birthdate, address, phone_number } = formData;
        if (!username || !password || !full_name || !birthdate || !address || !phone_number) {
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
        const result = await createUser(formData);
        console.log(result);
        setLoading(false);
        if (result?.message) {
            setFormData({
                username: '',
                password: '',
                full_name: '',
                birthdate: '',
                address: '',
                phone_number: '',
            });
            toast.success(`Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.`);
            closeModal();
            navigate('/');
        } else {
            toast.error(`Đăng ký thất bại. ${result?.detail}`);
        }
    };

    return (
        <div className="h-[80vh] space-y-8 bg-[#232627] rounded-2xl shadow-lg flex flex-row-reverse">
            <div className='w-full h-full flex flex-col justify-center items-center gap-y-2 p-10'>
                <h2 className="text-2xl font-bold text-white">Chào mừng đến với YÊN!</h2>
                <h2 className="text-xl font-bold text-white">Đăng ký</h2>
                <form className="grid grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleRegister}>
                    {['username', 'password', 'full_name', 'birthdate', 'address', 'phone_number'].map((field, idx) => (
                        <div key={idx} className="col-span-1 flex items-center mb-4">
                            <label className="text-white mr-2 w-1/3 capitalize">{field}</label>
                            <Input
                                id={field}
                                type={field === 'password' ? 'password' : field === 'birthdate' ? 'date' : 'text'}
                                placeholder={field === 'birthdate' ? 'YYYY-MM-DD' : ''}
                                size="large"
                                className="w-2/3 mt-2"
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            />
                        </div>
                    ))}
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="col-span-2 w-full text-black py-2 mt-4 text-lg font-semibold"
                        style={{ backgroundColor: '#fadf03', borderColor: '#fadf03', height: '45px', borderRadius: '20px' }}
                        loading={loading}
                    >
                        Đăng ký
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Register;
