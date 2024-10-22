import { useState } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import useManageInfoApi from 'src/services/manageInfoService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateGrade({ openModal, closeModal, handleReload }) {
    const [formData, setFormData] = useState({
        number: '',
        colorCode: '',
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createGrade } = useManageInfoApi();

    const handleCreateGrade = async () => {
        if (!formData.number) {
            setErrorMessages('Vui lòng nhập tên khóa học');
            return;
        }

        if (!formData.colorCode) {
            setErrorMessages('Vui lòng nhập màu hiển thị');
            return;
        }

        const result = await createGrade(formData);

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Khóa học đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Tạo khóa học thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setFormData({});
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Tạo khóa học thành công');
        }
    };

    return (
        <Modal
            title="Tạo kỳ học"
            open={openModal}
            onCancel={() => {
                setFormData({});
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleCreateGrade}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Khóa</Typography>
                    <Input
                        placeholder="Nhập khóa"
                        type="number"
                        value={formData?.number}
                        onChange={(e) => {
                            setFormData({ ...formData, number: e.target.value });
                            setErrorMessages('');
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Typography>Màu hiển thị</Typography>
                    <Input
                        placeholder="Màu hiển thị"
                        value={formData?.colorCode}
                        onChange={(e) => {
                            setFormData({ ...formData, colorCode: e.target.value });
                            setErrorMessages('');
                        }}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default CreateGrade;
