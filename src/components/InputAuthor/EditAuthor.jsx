import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, DatePicker } from 'antd';
import moment from 'moment';
import useManageAuthorApi from 'src/services/manageAuthorService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

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

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Tác giả đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật tác giả thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setName('');
            setBirthdate(null);
            setAddress('');
            setPenName('');
            setBiography('');
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Cập nhật tác giả thành công');
        }
    };

    return (
        <Modal
            title="Sửa thông tin tác giả"
            open={openModal}
            onCancel={() => {
                setName('');
                setBirthdate(null);
                setAddress('');
                setPenName('');
                setBiography('');
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleEditAuthor}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên tác giả</Typography>
                    <Input
                        placeholder="Nhập tên tác giả"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorMessages('');
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Ngày sinh</Typography>
                    <DatePicker
                        placeholder="Chọn ngày sinh"
                        value={birthdate}
                        onChange={(date) => setBirthdate(date)}
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Địa chỉ</Typography>
                    <Input
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Bút danh</Typography>
                    <Input
                        placeholder="Nhập bút danh"
                        value={penName}
                        onChange={(e) => setPenName(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tiểu sử</Typography>
                    <Input.TextArea
                        placeholder="Nhập tiểu sử"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditAuthor);
