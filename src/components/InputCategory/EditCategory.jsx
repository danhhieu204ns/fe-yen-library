import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Divider, Button } from 'antd';
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
            footer={[
                <Button key="back" onClick={closeModal}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleEditCategory}>
                    Cập nhật
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
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorMessages('');
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Độ tuổi giới hạn</Typography.Text>
                        </div>
                        <Input
                            placeholder="Nhập độ tuổi giới hạn"
                            type="number"
                            value={ageLimit}
                            onChange={(e) => setAgeLimit(e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Mô tả</Typography.Text>
                        </div>
                        <Input.TextArea
                            placeholder="Nhập mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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

export default memo(EditCategory);
