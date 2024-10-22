import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import useManagePublisherApi from 'src/services/managePublisherService'; // Đổi sang dịch vụ quản lý nhà xuất bản
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function EditPublisher({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessages, setErrorMessages] = useState('');

    const { editPublisher } = useManagePublisherApi();

    useEffect(() => {
        if (data) {
            setName(data?.name || '');
            setPhoneNumber(data?.phone_number || '');
            setAddress(data?.address || '');
            setEmail(data?.email || '');
        }
    }, [data]);

    const handleEditPublisher = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên nhà xuất bản');
            return;
        }

        const updatedData = {
            name: name.trim(),
            phone_number: phoneNumber.trim(),
            address: address.trim(),
            email: email.trim(),
        };

        const result = await editPublisher(data.id, updatedData);

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Nhà xuất bản đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật nhà xuất bản thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setName('');
            setPhoneNumber('');
            setAddress('');
            setEmail('');
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Cập nhật nhà xuất bản thành công');
        }
    };

    return (
        <Modal
            title="Sửa thông tin nhà xuất bản"
            open={openModal}
            onCancel={() => {
                setName('');
                setPhoneNumber('');
                setAddress('');
                setEmail('');
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleEditPublisher}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên nhà xuất bản</Typography>
                    <Input
                        placeholder="Nhập tên nhà xuất bản"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorMessages('');
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Số điện thoại</Typography>
                    <Input
                        placeholder="Nhập số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Địa chỉ</Typography>
                    <Input
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Email</Typography>
                    <Input
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditPublisher);
