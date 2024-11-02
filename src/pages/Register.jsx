import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input, Button, Modal, Upload } from 'antd';
import { CameraOutlined, UploadOutlined } from '@ant-design/icons';
import Webcam from 'react-webcam';
import { useUserApi } from 'src/services/userService';
import { setCredentials } from 'src/redux/auth/authSlice';

function Register({ closeModal }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        birthdate: '',
        address: '',
        phone_number: '',
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [useWebcam, setUseWebcam] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { createUser } = useUserApi();
    const webcamRef = useRef(null);
    const streamRef = useRef(null); // Sử dụng useRef để lưu MediaStream

    const validateForm = () => {
        const { username, password, name, birthdate, address, phone_number } = formData;
        if (!username || !password || !name || !birthdate || !address || !phone_number) {
            setError('Tất cả các trường đều phải được điền.');
            return false;
        }
        setError(null);
        return true;
    };
    async function startCamera() {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoElement = document.getElementById('video');
            if (videoElement) {
                videoElement.srcObject = streamRef.current;
            }
        } catch (err) {
            console.error("Lỗi khi truy cập máy ảnh:", err);
        }
    }
    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null; // Đặt lại stream sau khi dừng
        }
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        stopCamera(); // Dừng camera trước khi gửi yêu cầu
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
        if (imageData) {
            formDataToSend.append('image', imageData);
        }
        const result = await createUser(formDataToSend);
        setLoading(false);
        if (result?.detail === 400) {
            setError(`Đăng ký không thành công. ${result?.detail}`);
        } else if (result?.user) {
            setFormData({
                username: '',
                password: '',
                name: '',
                birthdate: '',
                address: '',
                phone_number: '',
            });
            closeModal();
            navigate('/');
        } else {
            toast.error(`Đăng ký thất bại. ${result?.detail}`);
        }
    };

    const handleFileChange = (info) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
            setImageData(reader.result);
        };
        reader.readAsDataURL(info.file);
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPreviewUrl(imageSrc);
        setImageData(imageSrc);
        setUseWebcam(false);
    };

    return (
        <div className="h-[80vh] space-y-8 bg-[#232627] rounded-2xl shadow-lg flex flex-row-reverse">
            <div className='w-full h-full flex flex-col justify-center items-center gap-y-2 p-10'>
                <h2 className="text-2xl font-bold text-white">Chào mừng đến với YÊN!</h2>
                <h2 className="text-xl font-bold text-white">Đăng ký</h2>
                <form className="grid grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleRegister}>
                    {['username', 'password', 'name', 'birthdate', 'address', 'phone_number'].map((field, idx) => (
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

                    <div className="col-span-2 mb-4">
                        <label className="block text-white font-semibold mb-2">Ảnh khuôn mặt</label>
                        <div className="flex items-center space-x-4">
                            <Upload
                                beforeUpload={(file) => {
                                    handleFileChange({ file });
                                    return false;
                                }}
                                accept="image/*"
                                showUploadList={false}
                                className="w-1/2"
                            >
                                <Button icon={<UploadOutlined />} className="w-full">
                                    Tải ảnh từ máy
                                </Button>
                            </Upload>
                            <Button
                                icon={<CameraOutlined />}
                                onClick={() => {
                                    startCamera(); // Bắt đầu camera khi nhấn nút chụp ảnh
                                    setUseWebcam(true);
                                }}
                                className="w-1/2"
                            >
                                Chụp ảnh
                            </Button>
                        </div>
                    </div>

                    <Modal
                        open={useWebcam}
                        footer={null}
                        onCancel={() => {
                            setUseWebcam(false);
                            stopCamera();  // Dừng camera khi modal bị đóng
                        }}
                        title="Chụp ảnh từ webcam"
                    >
                      <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="w-full rounded"
                      />
                      <Button onClick={capture} className="w-full mt-4" type="primary">
                          Chụp ảnh
                      </Button>
                    </Modal>

                    {previewUrl && (
                        <div className="col-span-2 flex justify-center mt-4">
                            <img src={previewUrl} alt="Ảnh xem trước" className="w-32 h-32 rounded-full object-cover" />
                        </div>
                    )}

                    {error && <div className="col-span-2 text-red-500 text-center">{error}</div>}

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
