import { useState, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Divider, DatePicker } from 'antd';
import useManageAuthorApi from 'src/services/manageAuthorService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateAuthor({ openModal, closeModal, handleReload }) {
    const [authorInfo, setAuthorInfo] = useState({
        name: '',
        birthdate: null,
        address: '',
        pen_name: '',
        biography: ''
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createAuthor } = useManageAuthorApi();

    const handleCreateAuthor = async () => {
        const { name, birthdate } = authorInfo;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên tác giả');
            return;
        }

        const formattedData = {
            ...authorInfo,
            name: authorInfo.name.trim(),
            birthdate: birthdate ? birthdate.format('YYYY-MM-DD') : null,
            address: authorInfo.address.trim(),
            pen_name: authorInfo.pen_name.trim(),
            biography: authorInfo.biography.trim()
        };

        const result = await createAuthor(formattedData);

        if (result?.name === 'AxiosError') {
            toast.error('Tạo tác giả thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            resetForm();
            closeModal();
            handleReload();
            toast.success('Tạo tác giả thành công');
        }
    };

    const resetForm = () => {
        setAuthorInfo({
            name: '',
            birthdate: null,
            address: '',
            pen_name: '',
            biography: ''
        });
        setErrorMessages('');
    };

    const handleChange = (key, value) => {
        setAuthorInfo({
            ...authorInfo,
            [key]: value
        });
        setErrorMessages('');
    };

    return (
        <Modal
            title={<div className="text-lg">Tạo mới tác giả</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleCreateAuthor}
            maskClosable={false}
            centered
            width={600}
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
                        <Typography.Text strong className="text-base">Tên tác giả:</Typography.Text>
                        <Input
                            placeholder="Nhập tên tác giả"
                            value={authorInfo.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Ngày sinh:</Typography.Text>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày sinh"
                            value={authorInfo.birthdate}
                            onChange={(date) => handleChange('birthdate', date)}
                            format="DD/MM/YYYY"
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Địa chỉ:</Typography.Text>
                        <Input
                            placeholder="Nhập địa chỉ"
                            value={authorInfo.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Bút danh:</Typography.Text>
                        <Input
                            placeholder="Nhập bút danh"
                            value={authorInfo.pen_name}
                            onChange={(e) => handleChange('pen_name', e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tiểu sử:</Typography.Text>
                        <Input.TextArea
                            placeholder="Nhập tiểu sử"
                            value={authorInfo.biography}
                            onChange={(e) => handleChange('biography', e.target.value)}
                            rows={4}
                            className="mt-2"
                            style={{ resize: 'none' }}
                        />
                    </Col>
                    <ErrorMessage message={errorMessages} />
                </Row>
            </div>
        </Modal>
    );
}

export default memo(CreateAuthor);
