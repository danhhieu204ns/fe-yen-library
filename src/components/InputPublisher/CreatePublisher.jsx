import { memo, useState } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import useManageInfoApi from 'src/services/managePublisherService'; // Đổi sang dịch vụ quản lý nhà xuất bản
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreatePublisher({ openModal, closeModal, handleReload }) {
    const [publisherInfo, setPublisherInfo] = useState({
        name: '',
        phone_number: '',
        address: '',
        email: ''
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createPublisher } = useManageInfoApi();

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

        if (!address || address.trim().length === 0) {
            setErrorMessages('Vui lòng nhập địa chỉ');
            return;
        }

        if (!email || email.trim().length === 0) {
            setErrorMessages('Vui lòng nhập email');
            return;
        }

        // Gửi request tạo nhà xuất bản
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

        if (result?.name === 'AxiosError') {
            toast.error('Tạo nhà xuất bản thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setPublisherInfo({
                name: '',
                phone_number: '',
                address: '',
                email: ''
            });
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Tạo nhà xuất bản thành công');
        }
    };

    const handleChange = (key, value) => {
        setPublisherInfo({
            ...publisherInfo,
            [key]: value
        });
        setErrorMessages('');
    };

    return (
        <Modal
            title="Tạo nhà xuất bản"
            open={openModal}
            onCancel={() => {
                setPublisherInfo({
                    name: '',
                    phone_number: '',
                    address: '',
                    email: ''
                });
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleCreatePublisher}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên nhà xuất bản</Typography>
                    <Input
                        placeholder="Nhập tên nhà xuất bản"
                        value={publisherInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Số điện thoại</Typography>
                    <Input
                        placeholder="Nhập số điện thoại"
                        value={publisherInfo.phone_number}
                        onChange={(e) => handleChange('phone_number', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Địa chỉ</Typography>
                    <Input
                        placeholder="Nhập địa chỉ"
                        value={publisherInfo.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Email</Typography>
                    <Input
                        placeholder="Nhập email"
                        value={publisherInfo.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(CreatePublisher);
