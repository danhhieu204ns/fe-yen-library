import { memo, useState } from 'react';
import { Input, Typography, Col, Row, Modal, DatePicker } from 'antd';
import useManageInfoApi from 'src/services/manageAuthorService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';
import moment from 'moment';

function CreateAuthor({ openModal, closeModal, handleReload }) {
    const [authorInfo, setAuthorInfo] = useState({
        name: '',
        birthdate: null,
        address: '',
        pen_name: '',
        biography: ''
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createAuthor } = useManageInfoApi();

    const handleCreateAuthor = async () => {
        const { name, birthdate, address, pen_name, biography } = authorInfo;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên tác giả');
            return;
        }

        // Kiểm tra ngày sinh
        if (!birthdate || !moment(birthdate, 'DD/MM/YYYY', true).isValid()) {
            setErrorMessages('Ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng (dd/mm/yyyy)');
            return;
        }

        // Gửi request tạo tác giả
        const result = await createAuthor({
            name: name.trim(),
            birthdate: birthdate ? moment(birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            address: address.trim(),
            pen_name: pen_name.trim(),
            biography: biography.trim()
        });
        console.log(result)

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Tác giả đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Tạo tác giả thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setAuthorInfo({
                name: '',
                birthdate: null,
                address: '',
                pen_name: '',
                biography: ''
            });
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Tạo tác giả thành công');
        }
    };

    const handleChange = (key, value) => {
        setAuthorInfo({
            ...authorInfo,
            [key]: value
        });
        setErrorMessages('');
    };

    const handleDateChange = (date, dateString) => {
        if (dateString) {
            handleChange('birthdate', dateString);
        } else {
            handleChange('birthdate', null);
        }
    };

    return (
        <Modal
            title="Tạo tác giả"
            open={openModal}
            onCancel={() => {
                setAuthorInfo({
                    name: '',
                    birthdate: null,
                    address: '',
                    pen_name: '',
                    biography: ''
                });
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleCreateAuthor}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên tác giả</Typography>
                    <Input
                        placeholder="Nhập tên tác giả"
                        value={authorInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Ngày sinh</Typography>
                    {/* DatePicker cho phép nhập và chọn từ lịch */}
                    <DatePicker
                        style={{ width: '100%' }}
                        value={authorInfo.birthdate ? moment(authorInfo.birthdate, 'DD/MM/YYYY') : null}
                        onChange={handleDateChange}
                        format="DD/MM/YYYY"
                        inputReadOnly={false} // Cho phép nhập trực tiếp
                        allowClear
                    />
                </Col>
                <Col span={24}>
                    <Typography>Địa chỉ</Typography>
                    <Input
                        placeholder="Nhập địa chỉ"
                        value={authorInfo.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Bút danh</Typography>
                    <Input
                        placeholder="Nhập bút danh"
                        value={authorInfo.pen_name}
                        onChange={(e) => handleChange('pen_name', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tiểu sử</Typography>
                    <Input.TextArea
                        placeholder="Nhập tiểu sử"
                        value={authorInfo.biography}
                        onChange={(e) => handleChange('biography', e.target.value)}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(CreateAuthor);
