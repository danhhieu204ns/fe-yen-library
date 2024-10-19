import { useState, memo } from 'react';
import { Modal, Row, Col, Input, Typography, Select } from 'antd';
import { toast } from 'react-toastify';
import useManageLecturerApi from 'src/services/manageLecturerService';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateLecturer({ openModal, closeModal, handleReload }) {
    const [formData, setFormData] = useState({
        lecturerName: '',
        phoneNumber: '',
        email: '',
        hocHamHocVi: '',
        chTg: '',
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createLecturer } = useManageLecturerApi();

    const handleCreateLecturer = async () => {
        const errors = {};

        if (!formData.lecturerName) {
            errors.lecturerName = 'Vui lòng nhập tên giảng viên';
        }
        if (!formData.hocHamHocVi) {
            errors.hocHamHocVi = 'Vui lòng chọn học hàm/học vị';
        }
        if (!formData.chTg) {
            errors.chTg = 'Vui lòng chọn CH/TG';
        }

        //Nếu có lỗi, thiết lập thông báo lỗi và dừng việc gửi dữ liệu
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        const result = await createLecturer(formData);

        if (result) {
            setErrorMessages({});
            setFormData({});
            closeModal();
            handleReload();
            toast.success('Tạo giảng viên thành công');
        } else {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <Modal
            title="Thêm giảng viên"
            open={openModal}
            onCancel={() => {
                setFormData({});
                setErrorMessages({});
                closeModal();
            }}
            onOk={handleCreateLecturer}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>
                        Tên giảng viên <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Input
                        value={formData?.lecturerName}
                        onChange={(e) => {
                            setFormData({ ...formData, lecturerName: e.target.value });
                            setErrorMessages({ ...errorMessages, lecturerName: '' });
                        }}
                    />
                    <ErrorMessage message={errorMessages.lecturerName} />
                </Col>
                <Col span={12}>
                    <Typography>
                        Học hàm/Học vị <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Select
                        value={formData?.hocHamHocVi}
                        onChange={(value) => {
                            setFormData({ ...formData, hocHamHocVi: value });
                            setErrorMessages({ ...errorMessages, hocHamHocVi: '' });
                        }}
                        options={[
                            {
                                value: 'Cử nhân',
                                label: 'Cử nhân',
                            },
                            {
                                value: 'Kỹ sư',
                                label: 'Kỹ sư',
                            },
                            {
                                value: 'Thạc sĩ',
                                label: 'Thạc sĩ',
                            },
                            {
                                value: 'Tiến sĩ',
                                label: 'Tiến sĩ',
                            },
                            {
                                value: 'Phó Giáo sư',
                                label: 'Phó Giáo sư',
                            },
                            {
                                value: 'Giáo sư',
                                label: 'Giáo sư',
                            },
                        ]}
                        style={{ width: '100%' }}
                    />
                    <ErrorMessage message={errorMessages.hocHamHocVi} />
                </Col>
                <Col span={12}>
                    <Typography>Số điện thoại</Typography>
                    <Input
                        value={formData?.phoneNumber}
                        onChange={(e) => {
                            setFormData({ ...formData, phoneNumber: e.target.value });
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Typography>Email</Typography>
                    <Input
                        value={formData?.email}
                        type="email"
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Typography>
                        CH/TG <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Select
                        value={formData?.chTg}
                        onChange={(value) => {
                            setFormData({ ...formData, chTg: value });
                            setErrorMessages({ ...errorMessages, chTg: '' });
                        }}
                        options={[
                            {
                                value: 'CH',
                                label: 'CH',
                            },
                            {
                                value: 'TG',
                                label: 'TG',
                            },
                        ]}
                        style={{ width: '100%' }}
                    />
                    <ErrorMessage message={errorMessages.chTg} />
                </Col>
            </Row>
        </Modal>
    );
}

export default memo(CreateLecturer);
