import { memo, useState } from 'react';
import { Input, Typography, Col, Row, Modal, Divider } from 'antd';
import useManageInfoApi from 'src/services/manageCategoryService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateCategory({ openModal, closeModal, handleReload }) {
    const [categoryInfo, setCategoryInfo] = useState({
        name: '', // Tên thể loại
        age_limit: '', // Độ tuổi giới hạn
        description: '' // Mô tả cho thể loại
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createCategory } = useManageInfoApi();

    const handleCreateCategory = async () => {
        const { name, age_limit, description } = categoryInfo;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên thể loại');
            return;
        }

        if (!age_limit || isNaN(age_limit) || age_limit <= 0) {
            setErrorMessages('Vui lòng nhập độ tuổi giới hạn hợp lệ');
            return;
        }

        // Gửi request tạo thể loại
        const result = await createCategory({
            name: name.trim(),
            age_limit: parseInt(age_limit, 10), // Chuyển đổi sang số nguyên
            description: description.trim()
        });

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Thể loại đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Tạo thể loại thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setCategoryInfo({
                name: '',
                age_limit: '',
                description: ''
            });
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Tạo thể loại thành công');
        }
    };

    const handleChange = (key, value) => {
        setCategoryInfo({
            ...categoryInfo,
            [key]: value
        });
        setErrorMessages('');
    };

    return (
        <Modal
            title="Tạo thể loại"
            open={openModal}
            onCancel={() => {
                setCategoryInfo({
                    name: '',
                    age_limit: '',
                    description: ''
                });
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleCreateCategory}
            maskClosable={false}
            centered
            style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Tên thể loại</Typography.Title>
                    <Input
                        placeholder="Nhập tên thể loại"
                        value={categoryInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Độ tuổi giới hạn</Typography.Title>
                    <Input
                        placeholder="Nhập độ tuổi giới hạn"
                        value={categoryInfo.age_limit}
                        onChange={(e) => handleChange('age_limit', e.target.value)}
                        type="number"
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Mô tả</Typography.Title>
                    <Input.TextArea
                        placeholder="Nhập mô tả cho thể loại"
                        value={categoryInfo.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(CreateCategory);
