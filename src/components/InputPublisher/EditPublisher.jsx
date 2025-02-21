import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Button } from 'antd';
import useManagePublisherApi from 'src/services/managePublisherService';
import { toast } from 'react-toastify';

function EditPublisher({ openModal, closeModal, handleReload, data }) {
    const [publisherInfo, setPublisherInfo] = useState({
        name: '',
        phone_number: '',
        address: '',
        email: ''
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { editPublisher } = useManagePublisherApi();

    useEffect(() => {
        if (data) {
            setPublisherInfo({
                name: data?.name || '',
                phone_number: data?.phone_number || '',
                address: data?.address || '',
                email: data?.email || ''
            });
        }
    }, [data]);

    const handleEditPublisher = async () => {
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

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErrorMessages('Email không hợp lệ');
                return;
            }
        }

        const result = await editPublisher(data.id, {
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
            toast.success('Cập nhật nhà xuất bản thành công');
        } else {
            toast.error('Cập nhật nhà xuất bản thất bại');
        }
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
            title="Sửa thông tin nhà xuất bản"
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            footer={[
                <Button key="back" onClick={closeModal}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleEditPublisher}>
                    Cập nhật
                </Button>,
            ]}
            maskClosable={false}
            centered
            width={600}
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
                            onChange={(e) => {
                                setPublisherInfo({
                                    ...publisherInfo,
                                    name: e.target.value
                                });
                                setErrorMessages('');
                            }}
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
                            onChange={(e) => {
                                setPublisherInfo({
                                    ...publisherInfo,
                                    phone_number: e.target.value
                                });
                                setErrorMessages('');
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Địa chỉ</Typography.Text>
                        </div>
                        <Input
                            placeholder="Nhập địa chỉ"
                            value={publisherInfo.address}
                            onChange={(e) => {
                                setPublisherInfo({
                                    ...publisherInfo,
                                    address: e.target.value
                                });
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Email</Typography.Text>
                        </div>
                        <Input
                            placeholder="Nhập email"
                            value={publisherInfo.email}
                            onChange={(e) => {
                                setPublisherInfo({
                                    ...publisherInfo,
                                    email: e.target.value
                                });
                            }}
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

export default memo(EditPublisher);
