import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Divider, DatePicker } from 'antd';
import useManageAuthorApi from 'src/services/manageAuthorService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';
import moment from 'moment';

function EditAuthor({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [address, setAddress] = useState('');
    const [penName, setPenName] = useState('');
    const [biography, setBiography] = useState('');
    const [errorMessages, setErrorMessages] = useState('');

    const { editAuthor } = useManageAuthorApi();

    useEffect(() => {
        if (data) {
            setName(data?.name || '');
            setBirthdate(data?.birthdate ? moment(data.birthdate) : null);
            setAddress(data?.address || '');
            setPenName(data?.pen_name || '');
            setBiography(data?.biography || '');
        }
    }, [data]);

    const handleEditAuthor = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên tác giả');
            return;
        }

        const updatedData = {
            name: name.trim(),
            birthdate: birthdate ? birthdate.format('YYYY-MM-DD') : null,
            address: address.trim(),
            pen_name: penName.trim(),
            biography: biography.trim(),
        };

        const result = await editAuthor(data.id, updatedData);

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật tác giả thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            resetForm();
            closeModal();
            handleReload();
            toast.success('Cập nhật tác giả thành công');
        }
    };

    const resetForm = () => {
        setName('');
        setBirthdate(null);
        setAddress('');
        setPenName('');
        setBiography('');
        setErrorMessages('');
    };

    return (
        <Modal
            title={<div className="text-lg">Sửa thông tin tác giả</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleEditAuthor}
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
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorMessages('');
                            }}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Ngày sinh:</Typography.Text>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày sinh"
                            value={birthdate}
                            onChange={(date) => setBirthdate(date)}
                            format="DD/MM/YYYY"
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Địa chỉ:</Typography.Text>
                        <Input
                            placeholder="Nhập địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Bút danh:</Typography.Text>
                        <Input
                            placeholder="Nhập bút danh"
                            value={penName}
                            onChange={(e) => setPenName(e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tiểu sử:</Typography.Text>
                        <Input.TextArea
                            placeholder="Nhập tiểu sử"
                            value={biography}
                            onChange={(e) => setBiography(e.target.value)}
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

export default memo(EditAuthor);
