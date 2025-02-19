import { useState, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Button } from 'antd';
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

    const resetForm = () => {
        setCategoryInfo({
            name: '',
            age_limit: '',
            description: ''
        });
        setErrorMessages('');
    };

    return (
        <Modal
            title="Thêm thể loại"
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            footer={[
                <Button key="back" onClick={closeModal}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateCategory}>
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
                            <Typography.Text strong>Tên thể loại</Typography.Text>
                            <span className="text-red-500 ml-1">*</span>
                        </div>
                        <Input
                            placeholder="Nhập tên thể loại"
                            value={categoryInfo.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Độ tuổi giới hạn</Typography.Text>
                        </div>
                        <Input
                            placeholder="Nhập độ tuổi giới hạn"
                            type="number"
                            value={categoryInfo.age_limit}
                            onChange={(e) => handleChange('age_limit', e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Mô tả</Typography.Text>
                        </div>
                        <Input.TextArea
                            placeholder="Nhập mô tả"
                            value={categoryInfo.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
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

export default memo(CreateCategory);
