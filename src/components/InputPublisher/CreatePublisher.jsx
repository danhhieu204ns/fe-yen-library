import { useState, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Button } from 'antd';
import useManagePublisherApi from 'src/services/managePublisherService';
import { toast } from 'react-toastify';

function CreatePublisher({ openModal, closeModal, handleReload }) {
    const [publisherInfo, setPublisherInfo] = useState({
        name: '',
        phone_number: '',
        address: '',
        email: ''
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createPublisher } = useManagePublisherApi();

    const handleCreatePublisher = async () => {
        const { name, phone_number, address, email } = publisherInfo;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên nhà xuất bản');
            return;
        }

        if (!phone_number || phone_number.trim().length === 0) {
            setErrorMessages('Vui lòng nhập số điện thoại');
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone_number)) {
            setErrorMessages('Số điện thoại không hợp lệ');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setErrorMessages('Email không hợp lệ');
            return;
        }

        const result = await createPublisher({
            name: name.trim(),
            phone_number: phone_number.trim(),
            address: address.trim(),
            email: email.trim()
        });

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Nhà xuất bản đã tồn tại');
            return;
        }

        if (result?.data) {
            resetForm();
            closeModal();
            handleReload();
            toast.success('Tạo nhà xuất bản thành công');
        } else {
            toast.error('Tạo nhà xuất bản thất bại');
        }
    };

    const handleChange = (key, value) => {
        setPublisherInfo({
            ...publisherInfo,
            [key]: value
        });
        setErrorMessages('');
    };

    const resetForm = () => {
        setPublisherInfo({
            name: '',
            phone_number: '',
            address: '',
            email: ''
        });
        setErrorMessages('');
    };

    return (
        <Modal
            title="Thêm nhà xuất bản"
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            footer={[
                <Button key="back" onClick={closeModal}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreatePublisher}>
                    Thêm
                </Button>,
            ]}
            maskClosable={false}
            centered
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
                background: '#fff',
            }}
        >
            <div className="p-4">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Tên nhà xuất bản</Typography.Text>
                            <span className="text-red-500 ml-1">*</span>
                        </div>
                        <Input
                            placeholder="Nhập tên nhà xuất bản"
                            value={publisherInfo.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Số điện thoại</Typography.Text>
                            <span className="text-red-500 ml-1">*</span>
                        </div>
                        <Input
                            placeholder="Nhập số điện thoại"
                            value={publisherInfo.phone_number}
                            onChange={(e) => handleChange('phone_number', e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Địa chỉ</Typography.Text>
                        </div>
                        <Input
                            placeholder="Nhập địa chỉ"
                            value={publisherInfo.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Email</Typography.Text>
                        </div>
                        <Input
                            placeholder="Nhập email"
                            value={publisherInfo.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </Col>
                    {errorMessages && (
                        <Col span={24}>
                            <div className="text-red-500">{errorMessages}</div>
                        </Col>
                    )}
                </Row>
            </div>
        </Modal>
    );
}

export default memo(CreatePublisher);
