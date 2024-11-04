import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import useManageGenreApi from 'src/services/manageGenreService'; // Thay đổi dịch vụ
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function EditGenre({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState(''); // Tên thể loại
    const [description, setDescription] = useState(''); // Mô tả thể loại
    const [ageLimit, setAgeLimit] = useState(0); // Giới hạn độ tuổi
    const [errorMessages, setErrorMessages] = useState('');

    const { editGenre } = useManageGenreApi(); // Thay đổi hàm gọi API

    useEffect(() => {
        if (data) {
            setName(data?.name || '');
            setDescription(data?.description || '');
            setAgeLimit(data?.age_limit || 0); // Khởi tạo giá trị giới hạn độ tuổi
        }
    }, [data]);

    const handleEditGenre = async () => {
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

        const result = await editGenre(data.id, updatedData); // Cập nhật thể loại

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
            onOk={handleEditGenre}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên thể loại</Typography>
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
                    <Typography>Mô tả</Typography>
                    <Input.TextArea
                        placeholder="Nhập mô tả cho thể loại"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Giới hạn độ tuổi</Typography>
                    <Input
                        type="number"
                        placeholder="Nhập giới hạn độ tuổi"
                        value={ageLimit}
                        onChange={(e) => {
                            setAgeLimit(Number(e.target.value));
                            setErrorMessages('');
                        }}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditGenre);
