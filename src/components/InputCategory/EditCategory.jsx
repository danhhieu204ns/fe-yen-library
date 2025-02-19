import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Divider } from 'antd';
import useManageCategoryApi from 'src/services/manageCategoryService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function EditCategory({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState(''); // Tên thể loại
    const [description, setDescription] = useState(''); // Mô tả thể loại
    const [ageLimit, setAgeLimit] = useState(0); // Giới hạn độ tuổi
    const [errorMessages, setErrorMessages] = useState('');

    const { editCategory } = useManageCategoryApi();

    useEffect(() => {
        if (data) {
            setName(data?.name || '');
            setDescription(data?.description || '');
            setAgeLimit(data?.age_limit || 0); // Khởi tạo giá trị giới hạn độ tuổi
        }
    }, [data]);

    const handleEditCategory = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên thể loại');
            return;
        }
        if (ageLimit < 0) {
            setErrorMessages('Giới hạn độ tuổi không được âm');
            return;
        }

        const updatedData = {
            name: name.trim(),
            description: description.trim(),
            age_limit: ageLimit, // Thêm giới hạn độ tuổi vào dữ liệu cập nhật
        };

        const result = await editCategory(data.id, updatedData); // Cập nhật thể loại

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Thể loại đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật thể loại thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setName('');
            setDescription('');
            setAgeLimit(0); // Reset giới hạn độ tuổi
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Cập nhật thể loại thành công');
        }
    };

    return (
        <Modal
            title="Sửa thông tin thể loại"
            open={openModal}
            onCancel={() => {
                setName('');
                setDescription('');
                setAgeLimit(0); // Reset giới hạn độ tuổi khi đóng modal
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleEditCategory}
            maskClosable={false}
            centered
            style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Tên thể loại</Typography.Title>
                    <Input
                        placeholder="Nhập tên thể loại"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorMessages('');
                        }}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Mô tả</Typography.Title>
                    <Input.TextArea
                        placeholder="Nhập mô tả cho thể loại"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Giới hạn độ tuổi</Typography.Title>
                    <Input
                        type="number"
                        placeholder="Nhập giới hạn độ tuổi"
                        value={ageLimit}
                        onChange={(e) => {
                            setAgeLimit(Number(e.target.value));
                            setErrorMessages('');
                        }}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditCategory);
