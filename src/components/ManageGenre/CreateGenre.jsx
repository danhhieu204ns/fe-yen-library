import { memo, useState } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import useManageInfoApi from 'src/services/manageGenreService'; // Thay đổi dịch vụ
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateGenre({ openModal, closeModal, handleReload }) {
    const [genreInfo, setGenreInfo] = useState({
        name: '', // Tên thể loại
        age_limit: '', // Độ tuổi giới hạn
        description: '' // Mô tả cho thể loại
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createGenre } = useManageInfoApi(); // Thay đổi hàm gọi API

    const handleCreateGenre = async () => {
        const { name, age_limit, description } = genreInfo;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên thể loại');
            return;
        }

        if (!age_limit || isNaN(age_limit) || age_limit <= 0) {
            setErrorMessages('Vui lòng nhập độ tuổi giới hạn hợp lệ');
            return;
        }

        // Gửi request tạo thể loại
        const result = await createGenre({
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
            setGenreInfo({
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
        setGenreInfo({
            ...genreInfo,
            [key]: value
        });
        setErrorMessages('');
    };

    return (
        <>
            <Modal
                title="Tạo thể loại"
                open={openModal}
                onCancel={() => {
                    setGenreInfo({
                        name: '',
                        age_limit: '',
                        description: ''
                    });
                    setErrorMessages('');
                    closeModal();
                }}
                onOk={handleCreateGenre}
                maskClosable={false}
            >
                <Row gutter={[12, 12]}>
                    <Col span={24}>
                        <Typography>Tên thể loại</Typography>
                        <Input
                            placeholder="Nhập tên thể loại"
                            value={genreInfo.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </Col>
                    <Col span={24}>
                        <Typography>Độ tuổi giới hạn</Typography>
                        <Input
                            placeholder="Nhập độ tuổi giới hạn"
                            value={genreInfo.age_limit}
                            onChange={(e) => handleChange('age_limit', e.target.value)}
                            type="number" // Đặt loại input thành số
                        />
                    </Col>
                    <Col span={24}>
                        <Typography>Mô tả</Typography>
                        <Input.TextArea
                            placeholder="Nhập mô tả cho thể loại"
                            value={genreInfo.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </Col>
                    <ErrorMessage message={errorMessages} />
                </Row>
            </Modal>
        </>
    );
}

export default memo(CreateGenre);
